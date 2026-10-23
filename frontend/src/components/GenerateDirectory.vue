<template>
  <v-btn
  variant="outlined"
  color="primary"
  prepend-icon="mdi-printer"
  @click="pdfGeneration">
    Print Directory
  </v-btn>
</template>

<script>
import FamilyPersonService from "../services/FamilyPersonService";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default ({
    name: "GenerateDirectory",
    props: ['families'],
    data() {
        return {
            path: "",
            doc: [],
            images: {},
            familyMembers: []
            
        };
    },
    created()  {
        console.log(this.families)
        for(let i = 0; i < this.families.length; i++)
            this.getPeopleForFamily(this.families[i].fam_ID, i);
    },
    methods: 
    {
        getPeopleForFamily(fam_ID, index)  {
			FamilyPersonService.getFamilyPersons(fam_ID)
			.then(response => {
				let familyPersons = response.data;
                this.familyMembers[index] = familyPersons
                    .filter(familyPerson => familyPerson.person)
                    .map(familyPerson => familyPerson.person.frst_name)
                    .join(", ");
			})
			.catch(error => {
				this.message = (error.response && error.response.data.message) || error.message;
			});
		},
        // pdfmake can only embed images given as data URLs, so download each
        // family photo and convert it. Families without a photo get no entry.
        loadImages() {
            const loads = this.families.map((family, j) => {
                if (!family.fam_pic) {
                    return Promise.resolve();
                }
                return fetch(this.path + family.fam_pic)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Photo not found: " + family.fam_pic);
                        }
                        return response.blob();
                    })
                    .then(blob => new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    }))
                    .then(dataUrl => {
                        this.images["image-" + j] = dataUrl;
                    })
                    .catch(err => {
                        // Leave this family's photo blank rather than failing the whole directory
                        console.log(err);
                    });
            });
            return Promise.all(loads);
        },
        // The photo cell for family i, or an empty cell of the same size
        imageCell(i) {
            if (!this.images["image-" + i]) {
                return { width: 160, height: 120, text: "", margin: [0, 20, 0, 0] };
            }
            return {
                image: "image-" + i,
                width: 160,
                height: 120,
                margin: [0, 20, 0, 0]
            };
        },
        pdfGeneration()  {
            this.images = {};
            this.loadImages().then(() => this.buildPdf());
        },
        buildPdf()  {
            for (let i = 0; i < this.families.length; i++)
            {
                let imageRow = [];
                let nameRow = {};
                let emailRow = {};
                let phoneRow = {};

                if(this.families[i])  {
                    imageRow[0] = this.imageCell(i)
                    imageRow[1] = {};
                    nameRow[0] = this.families[i].fam_name
                    emailRow[0] = (this.families[i].fam_email ? "Email: " + this.families[i].fam_email : "")
                    phoneRow[0] = (this.families[i].fam_phone ? "Phone: " + this.families[i].fam_phone : "")
                }
                else {
                    nameRow[0] = "";
                    emailRow[0] = "";
                    phoneRow[0] = "";
                    this.familyMembers[i] = "";
                }
                if(this.families[i + 1])  {
                    let temp = i + 1;
                    imageRow[2] = this.imageCell(temp);
                    imageRow[3] = {};
                    nameRow[1] = this.families[i + 1].fam_name
                    emailRow[1] = (this.families[i + 1].fam_email ? "Email: " + this.families[i + 1].fam_email : "")
                    phoneRow[1] = (this.families[i + 1].fam_phone ? "Phone: " + this.families[i + 1].fam_phone : "")
                }
                else {
                    imageRow[2] = {width: 160, text:""};
                    nameRow[1] = "";
                    emailRow[1] = "";
                    phoneRow[1] = "";
                    this.familyMembers[i + 1] = "";
                }
                if(this.families[i + 2])  {
                    let temp = i + 2;
                    imageRow[4] = this.imageCell(temp);
                    nameRow[2] = this.families[i + 2].fam_name
                    emailRow[2] = (this.families[i + 2].fam_email ? "Email: " + this.families[i + 2].fam_email : "")
                    phoneRow[2] = (this.families[i + 2].fam_phone ? "Phone: " + this.families[i + 2].fam_phone : "")
                } else {
                    imageRow[4] = {width: 160, text:""};
                    nameRow[2] = "";
                    emailRow[2] = "";
                    phoneRow[2] = "";
                    this.familyMembers[i + 2] = "";
                }
                console.log(imageRow);  

                let images = {
                    alignment: 'center',
                    columns: imageRow
                }
                let names = {
                    fontSize: 18,
                    alignment: 'center',
                    columns: [
                        {
                            text:nameRow[0]
                        },
                        {
                            text:nameRow[1]
                        },
                        {
                            text:nameRow[2]
                        }
                    ]
                }
                let familynames = {
                    fontSize: 12,
                    alignment: 'center',
                    columns: [
                        {
                            text:this.familyMembers[i]
                        },
                        {
                            text:this.familyMembers[i + 1]
                        },
                        {
                            text:this.familyMembers[i + 2]
                        }
                    ]
                } 
                let familyemails = {
                    fontSize: 10,
                    columns: [
                        {
                            text:emailRow[0]
                        },
                        {
                            text:emailRow[1]
                        },
                        {
                            text:emailRow[2]
                        }
                    ]
                }
                let familyphones = {
                    fontSize: 10,
                    columns: [
                        {
                            text:phoneRow[0]
                        },
                        {
                            text:phoneRow[1]
                        },
                        {
                            text:phoneRow[2]
                        }
                    ]
                } 
                this.doc.push(images);
                this.doc.push(names);
                this.doc.push(familynames);
                this.doc.push(familyemails);
                this.doc.push(familyphones);
                console.log(this.doc);
                i+=2
            }
            let background = {
                canvas: [
                    {
                        type: 'rect',
                        x: 20,
                        y: 20,
                        w: 555,
                        h: 800,
                        r: 5,
                        // lineWidth: 10,
                        lineColor: 'black',
                    }
                ]
            }
            
            let pdfContent = {
                background: background,
                content: this.doc,
                images: this.images
            }
            pdfMake.createPdf(pdfContent).open();
            this.doc = [];
            this.images = {};
        }
    },
    mounted() {
        if (process.env.NODE_ENV === "development") {
            this.path = "http://localhost:8080/api/images";
        } else {
            this.path = "/api/images";
        }
    }
})
</script>