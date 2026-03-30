const express = require('express');
const router = express.Router();

const DOCTYPE_FIELDS = {
  Contact: [
    { fieldname: 'first_name', label: 'First Name', fieldtype: 'Data', reqd: true },
    { fieldname: 'last_name', label: 'Last Name', fieldtype: 'Data', reqd: true },
    { fieldname: 'email', label: 'Email', fieldtype: 'Email' },
    { fieldname: 'phone', label: 'Phone', fieldtype: 'Phone' },
    { fieldname: 'status', label: 'Status', fieldtype: 'Select', options: 'Lead\nProspect\nCustomer' }
  ],
  Lead: [
    { fieldname: 'lead_name', label: 'Lead Name', fieldtype: 'Data', reqd: true },
    { fieldname: 'email', label: 'Email', fieldtype: 'Email' },
    { fieldname: 'company', label: 'Company', fieldtype: 'Data' },
    { fieldname: 'source', label: 'Source', fieldtype: 'Select', options: 'Web\nPhone\nEmail\nReferral' }
  ],
  Issue: [
    { fieldname: 'subject', label: 'Subject', fieldtype: 'Data', reqd: true },
    { fieldname: 'priority', label: 'Priority', fieldtype: 'Select', options: 'Low\nMedium\nHigh' },
    { fieldname: 'description', label: 'Description', fieldtype: 'Text' },
    { fieldname: 'status', label: 'Status', fieldtype: 'Select', options: 'Open\nIn Progress\nResolved\nClosed' }
  ]
};

router.get('/', (req, res) => {
  res.json(Object.keys(DOCTYPE_FIELDS));
});

router.get('/fields', (req, res) => {
  const doctype = String(req.query.doctype || '').trim();
  res.json(DOCTYPE_FIELDS[doctype] || []);
});

module.exports = router;
