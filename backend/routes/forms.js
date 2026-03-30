const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const FormSubmission = require('../models/FormSubmission');
const User = require('../models/User');
const Team = require('../models/Team');
const authMiddleware = require('../middleware/auth');

const DEFAULT_DOCTYPE_FIELDS = {
  Contact: [
    { label: 'First Name', fieldname: 'first_name', fieldtype: 'Data', reqd: true },
    { label: 'Last Name', fieldname: 'last_name', fieldtype: 'Data', reqd: true },
    { label: 'Email', fieldname: 'email', fieldtype: 'Email', reqd: true },
    { label: 'Phone', fieldname: 'phone', fieldtype: 'Phone' }
  ],
  Lead: [
    { label: 'Lead Name', fieldname: 'lead_name', fieldtype: 'Data', reqd: true },
    { label: 'Email', fieldname: 'email', fieldtype: 'Email' },
    { label: 'Status', fieldname: 'status', fieldtype: 'Select', options: 'New\nContacted\nQualified\nLost' }
  ],
  Issue: [
    { label: 'Subject', fieldname: 'subject', fieldtype: 'Data', reqd: true },
    { label: 'Priority', fieldname: 'priority', fieldtype: 'Select', options: 'Low\nMedium\nHigh' },
    { label: 'Description', fieldname: 'description', fieldtype: 'Textarea' }
  ]
};

function withIdx(fields = []) {
  return fields.map((field, index) => ({ ...field, idx: index + 1 }));
}

async function buildAccessList(form) {
  const owner = await User.findById(form.owner).select('email full_name');
  const ownerAccess = owner
    ? [{
        email: owner.email,
        full_name: owner.full_name || owner.email,
        user_image: null,
        read: true,
        write: true,
        share: true,
        submit: true
      }]
    : [];
  return [...ownerAccess, ...(form.shared_access || [])];
}

// Get all forms
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.team_id) filters.team = req.query.team_id;
    const forms = await Form.find(filters).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Validate route uniqueness
router.get('/validate-route/:route', async (req, res) => {
  try {
    const count = await Form.countDocuments({
      route: req.params.route,
      _id: { $ne: req.query.exclude_id }
    });
    res.json({ exists: count > 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if login required
router.get('/login-required', async (req, res) => {
  try {
    const form = await Form.findOne({ route: req.query.route });
    res.json({ loginRequired: form ? form.login_required : false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get public form
router.get('/public/:idOrRoute', async (req, res) => {
  try {
    const form = await Form.findOne({
      $or: [
        { _id: req.params.idOrRoute.match(/^[0-9a-fA-F]{24}$/) ? req.params.idOrRoute : null },
        { route: req.params.idOrRoute }
      ].filter((f) => f !== null)
    });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/link-options', async (req, res) => {
  try {
    const doctype = String(req.query.doctype || '').trim();
    if (!doctype) return res.json([]);

    if (doctype === 'User' || doctype === 'Contact') {
      const users = await User.find({}).select('email full_name').limit(100);
      return res.json(users.map((u) => ({ label: u.full_name || u.email, value: u.email })));
    }

    if (doctype === 'Team') {
      const teams = await Team.find({}).select('team_name');
      return res.json(teams.map((t) => ({ label: t.team_name, value: t.team_name })));
    }

    const forms = await Form.find({}).select('title route').limit(100);
    res.json(forms.map((f) => ({ label: f.title || f.route || f._id.toString(), value: f.route || f._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single form by ID or Route
router.get('/:idOrRoute', async (req, res) => {
  try {
    const form = await Form.findOne({
      $or: [
        { _id: req.params.idOrRoute.match(/^[0-9a-fA-F]{24}$/) ? req.params.idOrRoute : null },
        { route: req.params.idOrRoute }
      ].filter(f => f !== null)
    });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create form
router.post('/', authMiddleware, async (req, res) => {
  const teamId = req.body.team_id || req.body.team;
  const form = new Form({
    ...req.body,
    team: teamId,
    owner: req.user._id.toString(),
    route: req.body.route || `form-${Date.now()}`
  });
  try {
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/from-doctype', authMiddleware, async (req, res) => {
  try {
    const doctype = String(req.body.doctype || '').trim() || 'Contact';
    const fields = withIdx(DEFAULT_DOCTYPE_FIELDS[doctype] || DEFAULT_DOCTYPE_FIELDS.Contact);
    const form = await Form.create({
      title: `${doctype} Form`,
      description: `Generated from ${doctype}`,
      linked_doctype: doctype,
      team: req.body.team_id,
      owner: req.user._id.toString(),
      route: `${doctype.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      fields,
      is_published: false
    });
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update form
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.team_id) payload.team = payload.team_id;
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!updatedForm) return res.status(404).json({ message: 'Form not found' });
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.team_id) payload.team = payload.team_id;
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!updatedForm) return res.status(404).json({ message: 'Form not found' });
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id/access', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    const list = await buildAccessList(form);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/access', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const userIdOrEmail = String(req.body.userId || '').trim();
    if (!userIdOrEmail) {
      return res.status(400).json({ message: 'userId is required' });
    }

    let user = null;
    if (userIdOrEmail.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(userIdOrEmail).select('email full_name');
    }
    if (!user) {
      user = await User.findOne({ email: userIdOrEmail }).select('email full_name');
    }

    const email = user?.email || userIdOrEmail;
    const existingIndex = (form.shared_access || []).findIndex((a) => a.email === email);
    const entry = {
      email,
      full_name: user?.full_name || email,
      user_image: null,
      read: !!req.body.read,
      write: !!req.body.write,
      share: !!req.body.share,
      submit: !!req.body.submit
    };

    if (existingIndex >= 0) {
      form.shared_access[existingIndex] = entry;
    } else {
      form.shared_access.push(entry);
    }

    await form.save();
    res.json(await buildAccessList(form));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/access', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const email = String(req.body.userId || '').trim();
    const permission = String(req.body.permission || '').trim();
    const value = !!req.body.value;
    const allowedPermissions = new Set(['read', 'write', 'share', 'submit']);
    if (!email || !allowedPermissions.has(permission)) {
      return res.status(400).json({ message: 'Invalid permission update payload' });
    }

    const access = (form.shared_access || []).find((a) => a.email === email);
    if (!access) {
      return res.status(404).json({ message: 'Access entry not found' });
    }
    access[permission] = value;
    await form.save();

    res.json(await buildAccessList(form));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id/access/:userEmail', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    form.shared_access = (form.shared_access || []).filter((entry) => entry.email !== req.params.userEmail);
    await form.save();
    res.json(await buildAccessList(form));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Submit form response
router.post('/:id/submissions', async (req, res) => {
  try {
    const submission = new FormSubmission({
      form: req.params.id,
      data: req.body.values || req.body.data || {},
      status: req.body.status || 'Submitted',
      submitted_by: req.body.user_id || 'Guest'
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

