import { LightningElement, wire, track ,} from 'lwc';
import APPOINTMENT_OBJECT from '@salesforce/schema/Appointment_Detail__c';
import APPOINTMENT_DETAILS_OBJECT from '@salesforce/schema/Appointment_Detail__c.Contact__c';
import { createRecord, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAvailableSlots from '@salesforce/apex/AppointmentService.getAvailableSlots';


export default class AppointmentForm extends LightningElement {
    fieldname=APPOINTMENT_DETAILS_OBJECT;
    objectapiname=APPOINTMENT_OBJECT;
    @track subject;
    @track description;
    @track contact;
    @track appointmentDate;
    @track appointmentTime;
    @track errorMessage;
  


    handleSubjectChange(event) {
        this.subject = event.target.value;
    }
    handleDescriptionChange(event) {
        this.description = event.target.value;
    }
    handleDateChange(event) {
        this.appointmentDate = event.target.value;
       
    }
    handleTimeChange(event) {
        this.appointmentTime = event.target.value;
    }
    handleContactChange(event) {
        this.contact = event.detail.value; // assuming the event provides the Contact Id
    }
   

    checkAvailability(){
        console.log("Under Availability Date"+this.appointmentDate);
        console.log("Under Availability Time"+this.appointmentTime);
        getAvailableSlots({appontmentDate: this.appointmentDate,appointmentTime:this.appointmentTime})
        .then(result => {
            /*
            if (result.startsWith('slot available')) {  // Assuming standard record Ids
                // Handle success - perhaps navigate to the record or show a toast
            } else {
                this.errorMessage = result;  // Display error message from Apex
            }
            */
            
            if(Object.keys(result).length !=0){
                this.errorMessage = "slot is available.";
            }
            if(Object.keys(result).length ===0){
                this.errorMessage = "slot is available.";
            }
        })
        .catch(error => {
            this.errorMessage = "slot is not available.";
        });
       
    
     //  @track getRecord;
        // Use `getRecord` from `lightning/uiRecordApi` to check available slots
        // Display toast message or a modal with available slots
    }

    handleSubmit(){
        // Validate fields
        if(!this.subject || !this.description || this.contact || !this.appointmentDate || !this.appointmentTime) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }     

        // Apply logic to validate against other requirements
        // If everything is okay, save the record using `createRecord`

        const fields = {
            'Subject__c': this.subject,
            'Description__c': this.description,
            'Contact__c': this.contact,
            'Appointment_Date__c': this.appointmentDate,
            'Appointment_Time__c': this.appointmentTime,
        };

        createRecord({
            apiName: 'Appointment_Detail__c',
            fields
        })
        .then(() => {
            this.showToast('Success', 'Appointment created successfully', 'success');
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}