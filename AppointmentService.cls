public class AppointmentService {

    @AuraEnabled(cacheable=true)
    public static List<Appointment_Detail__c> getAvailableSlots(Date appointmentDate, Time appointmentTime) {
        System.debug('AppointDate'+appointmentDate) ;
        System.debug('appointmentTime'+appointmentTime);
        return [SELECT Appointment_Date__c	, Appointment_Time__c	, Contact__c
                FROM Appointment_Detail__c 
                WHERE Appointment_Date__c =:appointmentDate 
                AND Appointment_Time__c =: appointmentTime];
    }
}