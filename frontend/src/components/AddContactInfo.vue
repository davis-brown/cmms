<template>
    <div>
        <v-card>
            <v-form v-model="validEmail">
                <v-data-table
                :headers="emailheaders"
                :items="emails"
                hide-default-footer
                >
                <template v-slot:[`item.primary`]="{ item }">
                    <v-radio-group
                    v-model="person.email"
                    name="rowSelector">
                    <div class="d-flex justify-center"><v-radio :value="item.address"/></div>
                    </v-radio-group>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                        @click="deleteEmail(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:[`body.append`]>
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
                    <template v-slot:[`item.primary`]="{ item }">
                        <v-radio-group
                        v-model="person.phone"
                        name="rowSelector">
                        <div class="d-flex justify-center"><v-radio :value="item.number"/></div>
                        </v-radio-group>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            @click="deletePhone(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:[`body.append`]>
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
        <v-divider></v-divider>
        <v-card>
            <v-form v-model="validAddress">
                <v-data-table
                :headers="addressheaders"
                :items="addresses"
                hide-default-footer
                >
                    <template v-slot:item.primary="{ item }">
                        <v-radio-group
                        v-model="person.address"
                        name="rowSelector">
                        <div class="d-flex justify-center"><v-radio :value="item.address"/></div>
                        </v-radio-group>
                    </template>
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
                                v-model="currentAddress.address"
                                :rules="addressRules"
                                label="Street Address"
                                required
                                ></v-text-field>
                            </td>
                            <td center>
                                <v-btn :disabled="!validAddress" small @click="addAddress()" >
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
    props: ['personContacts', 'person'],
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
            validAddress: false,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^\S{1,}@\S{2,}\.\S{2,}$/.test(v) || 'E-mail must be valid',
            ],
            phoneRules: [
                v => !!v || 'Phone number is required.',
                v => (v || '').length == 10 || 'Phone number must be format ###-###-####',
                v => /(\d{3})-?(\d{3})-?(\d{4})/.test(v) || 'Phone number must be format ###-###-####'
            ],
            addressRules: [
                v => !!v || 'Address is required.'
            ],
            emailheaders: [
                        {
                            text: 'Email Address',
                            align: 'left',
                            value: 'address',
                            sortable: false,
                        },
                        {
                            text: 'Primary',
                            align: 'center',
                            value: 'primary',
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
                            text: 'Primary',
                            align: 'center',
                            value: 'primary',
                            sortable: false,
                        },
                        {
                            text: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            addressheaders: [
                        {
                            text: 'Street Address',
                            align: 'left',
                            value: 'address',
                            sortable: false,
                        },
                        {
                            text: 'Primary',
                            align: 'center',
                            value: 'primary',
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
            this.currentEmail = {}
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
            this.currentPhone = {}
        },
        deletePhone(personcontact) {
            this.personContacts = this.personContacts.filter(personContact => personContact.number!=personcontact.number);
            this.phones = this.phones.filter(phone => phone.number!=personcontact.number);
            this.currentPhone = {}
        },
        addAddress() {
            let address = {}
            address.address = this.currentAddress.address;
            address.vvg_ID = 1;
            address.vve_ID = 3;
            address.number = "";
            this.personContacts.push(address);
            this.addresses.push(address);
            this.currentAddress = {}
        },
        deleteAddress(personcontact) {
            this.personContacts = this.personContacts.filter(personContact => personContact.address!=personcontact.address);
            this.addresses = this.addresses.filter(address => address.address!=personcontact.address);
            this.currentAddress = {}
        },
    }
};
</script>

<style>

</style>