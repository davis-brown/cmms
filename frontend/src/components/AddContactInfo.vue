<template>
    <div>
        <v-card>
            <v-form v-model="validEmail">
                <v-data-table
                :headers="emailheaders"
                :items="emails"
                hide-default-footer
                >
                <template v-slot:item.actions="{ item }">
                    <v-icon
                        @click="deleteEmail(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:body.append>
                    <tr>
                        <td>
                            <v-text-field
                            v-model="currentEmail.address"
                            :rules="emailRules"
                            label="Email Address"
                            required
                            ></v-text-field>
                        </td>
                        <td center>
                            <v-btn :disabled="!validEmail" small @click="addEmail()" >
                            Add
                            </v-btn>
                        </td>
                    </tr>
                </template>
                </v-data-table>
            </v-form>
        </v-card>
        <v-divider></v-divider>
        <v-card>
            <v-form v-model="validPhone">
                <v-data-table
                :headers="phoneheaders"
                :items="phones"
                hide-default-footer
                >
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                            @click="deletePhone(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:body.append>
                        <tr>
                            <td>
                                <v-text-field
                                v-model="currentPhone.number"
                                :rules="phoneRules"
                                label="Phone Number"
                                required
                                ></v-text-field>
                            </td>
                            <td center>
                                <v-btn :disabled="!validPhone" small @click="addPhone()" >
                                Add
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-form>
        </v-card>
    </div>
</template>

<script>


export default {
	name: 'ContactInfo',
    props: ['personContacts'],
    data() {
        return {
            emails: [],
            phones: [],
            addresses: [],
            currentEmail: {},
            currentPhone: {},
            currentAddress: {},
            validEmail: false,
            validPhone: false,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            phoneRules: [
                v => !!v || 'Phone number is required.',
                v => (v || '').length == 10 || 'Phone number must be 10 digits',
                v => /(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/g.test(v) || 'Phone number must be correct format'
            ],

            emailheaders: [
                        {
                            text: 'Email Address',
                            align: 'left',
                            value: 'address',
                            sortable: false,
                        },
                        {
                            text: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            phoneheaders: [
                        {
                            text: 'Phone Number',
                            align: 'left',
                            value: 'number',
                            sortable: false,
                        },
                        {
                            text: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            
        };
    },
    
	methods: {
        addEmail() {
            let email = {}
            email.address = this.currentEmail.address;
            email.vvg_ID = 1;
            email.vve_ID = 1;
            email.number = "";
            this.personContacts.push(email);
            this.emails.push(email);
            
        },
        deleteEmail(personcontact) {
            this.personContacts = this.personContacts.filter(personContact => personContact.address!=personcontact.address);
            this.emails = this.emails.filter(email => email.address!=personcontact.address);
            this.currentEmail = {}
        },
        addPhone() {
            let phone = {}
            phone.number = this.currentPhone.number;
            phone.vvg_ID = 1;
            phone.vve_ID = 2;
            phone.address = "";
            this.personContacts.push(phone);
            this.phones.push(phone);
            
        },
        deletePhone(personcontact) {
            this.personContacts = this.personContacts.filter(personContact => personContact.number!=personcontact.number);
            this.phones = this.phones.filter(phone => phone.number!=personcontact.number);
            this.currentPhone = {}
        },
    },
    mounted() {
        this.getPersonContacts(this.person.per_ID);
    }
};
</script>

<style>

</style>