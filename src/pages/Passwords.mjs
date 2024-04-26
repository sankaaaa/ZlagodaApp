import pkg from 'bcryptjs';

const {hashSync} = pkg;
import {writeFile} from 'fs/promises';
import supabase from "../config/supabaseClient.js";

async function generatePasswordsJSON() {
    try {
        const {data: employees, error} = await supabase
            .from('employee')
            .select('id_employee, empl_role');

        if (error) throw error;

        if (employees) {
            const passwords = employees.map(employee => {
                const {id_employee, empl_role} = employee;
                const username = id_employee;
                const password = id_employee + empl_role;
                const hashedPassword = hashSync(password, 10);
                return {username, password: hashedPassword};
            });

            await writeFile('passwords.json', JSON.stringify(passwords, null, 2));
            console.log('Passwords JSON file created successfully.');
        }
    } catch (error) {
        console.error('Error generating passwords JSON:', error.message);
    }
}

generatePasswordsJSON();
