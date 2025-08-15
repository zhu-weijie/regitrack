export interface Vehicle {
    uuid: string;
    status: 'REGISTERED' | 'DEREGISTERED';
    start_date: string;
    end_date: string;
    time: string;
    user_uuid: string;
    brand: string;
    type: '5-seat' | '7-seat';
    vehicle_class: 'personal' | 'commercial';
}
