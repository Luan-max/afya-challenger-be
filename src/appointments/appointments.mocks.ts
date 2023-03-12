import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

export class AppoitmentMocks {
  public appointment = {
    id: '1',
    startDate: '2023-02-25T14:40:00.000Z',
    endDate: '2023-02-23T17:19:58.359Z',
    patientId: '1',
    createdAt: '2023-02-23T17:19:58.359Z',
    updatedAt: '2023-02-23T17:19:58.359Z',
  };

  public createAppointmentDto = {
    patientId: '1',
    startDate: '2023-02-25T14:40:00.000Z',
  };
  public updateAppointmentDto: UpdateAppointmentDto = {
    startDate: '2023-02-25T14:40:00.000Z',
  };
  public expectedAppointment: Appointment = {
    id: '1',
    startDate: '2023-02-27 14:40:00.000Z',
    endDate: '2023-02-27 15:40:00.000Z',
    Notes: [],
    patientId: '91bf8fe2-3e78-4747-ac8d-68a88c390399',
    createdAt: new Date('2023-02-27 14:40:00.000Z'),
    updatedAt: new Date('2023-02-27 14:40:00.000Z'),
  };
}
