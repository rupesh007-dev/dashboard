// --- Master Validation Schema ---
const MASTER_VALIDATION_SCHEMA = {
  fieldRules: {
    email: {
      label: 'Email',
      regex: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
      error: 'Invalid email format. Must be lowercase, business-oriented.',
      required: true,
    },
    title: {
      label: 'Title',
      regex: '^[A-Za-z. ]{2,50}$',
      error: 'Title must contain only letters and spaces and dot, minimum 2 characters.',
      required: true,
    },
    firstName: {
      label: 'First Name',
      regex: '^[A-Z][a-z]{1,49}$',
      error: 'First name must start with uppercase, only letters allowed, no spaces.',
      required: true,
    },
    lastName: {
      label: 'Last Name',
      regex: '^[A-Z][a-z]{1,49}$',
      error: 'Last name must start with uppercase, only letters allowed, no spaces.',
      required: true,
    },
    companyTelephone: {
      label: 'Company Telephone',
      regex: '^\\+?[0-9]{7,15}$',
      error: "Invalid company telephone number. Only digits and optional leading '+' allowed.",
      required: true,
    },
    directTelephone: {
      label: 'Direct Telephone',
      regex: '^\\+?[0-9]{7,15}$',
      error: "Invalid direct telephone number. Only digits and optional leading '+' allowed.",
      required: false,
    },
    mobileTelephone: {
      label: 'Mobile Telephone',
      regex: '^\\+?[0-9]{7,15}$',
      error: "Invalid mobile number. Only digits and optional leading '+' allowed.",
      required: false,
    },
    region: {
      label: 'Region',
      regex: '^[A-Za-z ]{2,100}$',
      error: 'Region must contain only letters and spaces. No dots, hyphens, or apostrophes allowed.',
      required: true,
    },
    jobTitle: {
      label: 'Job Title',
      regex: '^[A-Za-z ]+$',
      error: 'Invalid job title. Only letters and spaces are allowed.',
      required: true,
    },
    audience: {
      label: 'Audience',
      regex: '^[A-Za-z ]{2,100}$',
      error: 'Audience must contain only letters and spaces. No numbers, dots, hyphens, or apostrophes allowed.',
      required: true,
    },
    authority: {
      label: 'Authority',
      regex: '^[A-Za-z ]{2,100}$',
      error: 'Authority must contain only letters and spaces. Numbers not allowed.',
      required: true,
    },
    addressline1: {
      label: 'Address Line 1',
      regex: '^[A-Za-z0-9 ]{2,100}$',
      error:
        'Address Line 1 can only contain letters, numbers, and spaces. No dots, hyphens, slashes, commas, or apostrophes allowed.',
      required: true,
    },
    addressline2: {
      label: 'Address Line 2',
      regex: "^[A-Za-z0-9 .,'/-]{0,100}$",
      error: 'Invalid address line 2.',
      required: false,
    },
    addressline3: {
      label: 'Address Line 3',
      regex: "^[A-Za-z0-9 .,'/-]{0,100}$",
      error: 'Invalid address line 3.',
      required: false,
    },
    addressCity: {
      label: 'Address City',
      regex: '^[A-Za-z ]{2,50}$',
      error: 'City must contain only letters and spaces. No dots, hyphens, or apostrophes allowed.',
      required: true,
    },
    addressStateCode: {
      label: 'Address State Code',
      regex: '^[A-Za-z ]{2,50}$',
      error: 'State code must contain only letters and spaces. No dots, hyphens, or apostrophes allowed.',
      required: true,
    },
    addressPostalCode: {
      label: 'Address Postal Code',
      regex: '^[A-Za-z0-9 ]{3,12}$',
      error: 'Invalid postal code. Ensure spaces are preserved and characters match address.',
      required: true,
    },
    addressCountryCode: {
      label: 'Address Country Code',
      regex: '^[A-Z]{2,4}$',
      error: 'Country code must be 2 to 4 uppercase letters (e.g., US, IN, GBR).',
      required: true,
    },
    companyName: {
      label: 'Company Name',
      regex: '^.{2,100}$',
      error: 'Invalid company name. Ensure exact spelling.',
      required: true,
    },
    companySize: {
      label: 'Company Size',
      regex: '^(?!\\s)(.*\\S)$',
      error: 'Invalid company size. Cannot be empty and cannot start or end with spaces.',
      required: true,
    },
    industry: {
      label: 'Industry',
      regex: "^[A-Za-z .,&'\\-()/!@#$%^*_=+?:;|]{2,100}$",
      error:
        'Invalid industry name. Only letters, spaces, and special characters are allowed. Numbers are not permitted.',
      required: true,
    },
    optInTime: {
      label: 'Opt-In Time',
      regex: '^.{2,100}$',
      error: 'Invalid date-time format. Use YYYY-MM-DD HH:MM or YYYY-MM-DD.',
      required: true,
    },
    iPAddress: {
      label: 'IP Address',
      regex: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
      error: 'Invalid IPv4 address.',
      required: false,
    },
    verificationURL: {
      label: 'Verification URL',
      regex: '^(https?:\\/\\/)?([\\w.-]+)\\.([a-z\\.]{2,6})([\\/\\w .-]*)*\\/?$',
      error: 'Invalid URL format.',
      required: false,
    },
    contentTitle: {
      label: 'Content Title',
      regex: '^.{2,150}$',
      error: 'Invalid content title',
      required: true,
    },
  },

  // Optional: cross-field validation rules
  valueRules: [],
};

// --- normalize labels (safe compare)
const normalizeLabel = (text) => {
  if (!text) return '';
  return text
    .replace(/\u00A0/g, ' ')
    .trim()
    .toLowerCase();
};

// --- convert to camelCase ---
const toCamelCase = (str) =>
  str
    .replace(/\u00A0/g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

function generateSchemaFromHeaders(headers, headersWithValues) {
  const filteredFieldRules = {};
  let verificationUrlIndex = -1;

  headers.forEach((header, idx) => {
    const fieldKey = toCamelCase(header);

    // Try to match with MASTER_VALIDATION_SCHEMA
    const matchedRule = Object.entries(MASTER_VALIDATION_SCHEMA.fieldRules).find(
      ([key, rule]) => normalizeLabel(rule.label) === normalizeLabel(header)
    );

    if (matchedRule) {
      // Use the original rule
      filteredFieldRules[fieldKey] = matchedRule[1];

      // Track verificationURL index
      if (fieldKey === 'verificationURL') verificationUrlIndex = idx;
    } else {
      // Column not in master schema => treat like contentTitle
      filteredFieldRules[fieldKey] = {
        label: header,
        regex: '^.{2,150}$',
        error: `Invalid value for ${header}`,
        required: true,
      };
    }
  });

  // Step 2: Keep only relevant valueRules from MASTER_VALIDATION_SCHEMA
  const filteredValueRules = MASTER_VALIDATION_SCHEMA.valueRules.filter((vr) =>
    vr.fieldNames.some((f) => filteredFieldRules[f])
  );

  Object.entries(headersWithValues).forEach(([column, values]) => {
    // Remove any value that starts with 'Options:'
    if (toCamelCase(column) == 'optintime') return;
    const cleanedValues = values.filter((v) => !v.startsWith('Options:'));

    if (cleanedValues && cleanedValues.length > 0) {
      filteredValueRules.push({
        mode: 'inclusion',
        fieldNames: [column],
        values: cleanedValues,
        error: `${column} is not in picklist`,
      });
    }
  });

  return {
    fieldRules: filteredFieldRules,
    valueRules: filteredValueRules,
  };
}

// --- Class wrapper for convenience ---
export default class ExcelAssignedTemplateGenerator {
  constructor(headers, headersWithValues = {}) {
    this.headers = headers;
    this.headersWithValues = headersWithValues;
  }

  generateValidationJson() {
    return generateSchemaFromHeaders(this.headers, this.headersWithValues);
  }
}
