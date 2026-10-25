<template>
    <!-- Edits the parent form's person (and contact list) in place -->
    <!-- eslint-disable vue/no-mutating-props -->
    <div>
        <v-card>
            <v-form v-model="validEmail">
                <v-data-table
                :headers="emailheaders"
                :items="emails"
                hide-default-footer
                no-data-text="None added yet"
                >
                <template v-slot:[`item.primary`]="{ item }">
                    <v-radio-group
                    v-model="person.email">
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
                    <tr class="add-row">
                        <td colspan="3">
                            <div class="add-line">
                            <v-text-field
                            v-model="currentEmail.address"
                            :rules="emailRules"
                            label="Email Address"
                            required
                            ></v-text-field>
                            <v-btn :disabled="!validEmail" @click="addEmail()"  color="primary" variant="flat">
                            Add
                            </v-btn>
                            </div>
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
                no-data-text="None added yet"
                >
                    <template v-slot:[`item.primary`]="{ item }">
                        <v-radio-group
                        v-model="person.phone">
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
                        <tr class="add-row">
                        <td colspan="3">
                            <div class="add-line">
                                <v-text-field
                                v-model="currentPhone.number"
                                :rules="phoneRules"
                                label="Phone Number"
                                required
                                ></v-text-field>
                            <v-btn :disabled="!validPhone" @click="addPhone()"  color="primary" variant="flat">
                                Add
                                </v-btn>
                            </div>
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
                no-data-text="None added yet"
                >
                    <template v-slot:[`item.primary`]="{ item }">
                        <v-radio-group
                        v-model="person.address">
                        <div class="d-flex justify-center"><v-radio :value="item.address"/></div>
                        </v-radio-group>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            @click="deleteAddress(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:[`body.append`]>
                        <tr class="add-row">
                        <td colspan="3">
                            <div class="add-line">
                                <v-text-field
                                v-model="currentAddress.address"
                                :rules="addressRules"
                                label="Street Address"
                                required
                                ></v-text-field>
                            <v-btn :disabled="!validAddress" @click="addAddress()"  color="primary" variant="flat">
                                Add
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                    </template>
                </v-data-table>
            </v-form>
        </v-card>
    </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
// Remove an item from an array in place. personContacts belongs to the parent
// form, so it has to be changed rather than replaced for the parent to see it.
const removeItem = (list, item) => {
    const index = list.indexOf(item);
    if (index != -1) {
        list.splice(index, 1);
    }
};

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
            // Any usual format (555-0101, (405) 555-0101, +1 405.555.0101) with 7 to 15 digits
            phoneRules: [
                v => !!v || 'Phone number is required.',
                v => (/^[0-9+().\s-]+$/.test(v || '') && /^\d{7,15}$/.test((v || '').replace(/\D/g, ''))) || 'Enter a valid phone number',
            ],
            addressRules: [
                v => !!v || 'Address is required.'
            ],
            emailheaders: [
                        {
                            title: 'Email Address',
                            align: 'left',
                            value: 'address',
                            sortable: false,
                        },
                        {
                            title: 'Primary',
                            align: 'center',
                            value: 'primary',
                            sortable: false,
                        },
                        {
                            title: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            phoneheaders: [
                        {
                            title: 'Phone Number',
                            align: 'left',
                            value: 'number',
                            sortable: false,
                        },
                        {
                            title: 'Primary',
                            align: 'center',
                            value: 'primary',
                            sortable: false,
                        },
                        {
                            title: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            addressheaders: [
                        {
                            title: 'Street Address',
                            align: 'left',
                            value: 'address',
                            sortable: false,
                        },
                        {
                            title: 'Primary',
                            align: 'center',
                            value: 'primary',
                            sortable: false,
                        },
                        {
                            title: 'Action',
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
            removeItem(this.personContacts, personcontact);
            removeItem(this.emails, personcontact);
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
            removeItem(this.personContacts, personcontact);
            removeItem(this.phones, personcontact);
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
            removeItem(this.personContacts, personcontact);
            removeItem(this.addresses, personcontact);
            this.currentAddress = {}
        },
    }
};
</script>

<style>

</style>