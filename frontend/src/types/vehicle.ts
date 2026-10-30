export interface VehicleRequest {
  registrationNumber: string;
  vehicleType: string;
  make: string;
  model: string;
}

export interface VehicleResponse {
  id: number;
  registrationNumber: string;
  vehicleType: string;
  make: string;
  model: string;
  userId: string;
}