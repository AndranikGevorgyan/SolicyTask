const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = './text.txt';

rl.question(`File Path - ${filePath}\n`, (answer) => {
  const file = fs.readFileSync(answer || filePath, 'utf8');
  const lines = file.split('\n').filter(Boolean);

  const records = [];
  const validations = [];

  lines.forEach((line, i) => {
    const [name, surname, separator, phoneNumber] = line.trim().split(' ').filter(Boolean);

    const isValidPhoneNumber = phoneNumber.length === 9;
    const isValidSeparator = separator === '-' || separator === ':';

    if (isValidPhoneNumber && isValidSeparator) {
      records.push({ name, surname, separator, phoneNumber });
    } else {
      validations.push(`line ${i + 1}: ${!isValidPhoneNumber ? 'phone number should be with 9 digits' : ''}${!isValidPhoneNumber && !isValidSeparator ? ', ' : ''}${!isValidSeparator ? 'the separator should be `:` or `-`' : ''}.`);
    }
  });

  rl.question('Please choose an ordering to sort: "Ascending" or "Descending".\n', (order) => {
    rl.question('Please choose criteria: "Name", "Surname" or "PhoneNumberCode".\n', (criteria) => {
      const compare = (a, b) => {
        let result;
        if (criteria === 'Name') {
          result = a.name.localeCompare(b.name);
        } else if (criteria === 'Surname') {
          result = a.surname.localeCompare(b.surname);
        } else if (criteria === 'PhoneNumberCode') {
          const aCode = a.phoneNumber.substring(0, 3);
          const bCode = b.phoneNumber.substring(0, 3);
          result = aCode.localeCompare(bCode);
        }
        return order === 'Descending' ? -result : result;
      };

      records.sort(compare);

      console.log('Sorted Records:');
      records.forEach(({ name, surname, separator, phoneNumber }) => {
        console.log(`${name} ${surname || ''} ${separator} ${phoneNumber}`);
      });

      if (validations.length) {
        console.log('\nValidations:');
        console.log(validations.join('\n'));
      }

      rl.close();
    });
  });
});
