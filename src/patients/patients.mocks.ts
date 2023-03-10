import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update.patient.dto';
import { Patient } from './entities/patient.entity';

export class PatientMocks {
  public patientId: '1';

  public createPatientMock: CreatePatientDto = {
    name: 'John Doe',
    phone: '+5511999999999',
    email: 'johndoe@example.com',
    birthday: new Date(),
    gender: 'M',
    height: '1.75',
    weight: '70',
  };

  public mockPatient: Patient = {
    ...this.createPatientMock,
    id: '1',
    birthday: new Date(),
    createdAt: '',
    updatedAt: '',
  };

  public updatePatientMock: UpdatePatientDto = {
    phone: '+5511999999999',
    email: 'johndoe@example.com',
  };

  public expectedPatient: Patient = {
    ...this.createPatientMock,
    id: '1',
    birthday: new Date(),
    createdAt: '',
    updatedAt: '',
  };

  public mockPatients = [
    {
      name: 'Thiago documentation',
      phone: '+55 11 99999-9999.',
      email: 'thiago.update@gmail.com',
      document: '33615840864',
      birthday: '1986-09-05 14:40:00.000Z',
      gender: 'male',
      height: '168',
      weight: '68',
      id: '91bf8fe2-3e78-4747-ac8d-68a88c390399',
      createdAt: '2023-02-24T19:20:30.338Z',
      updatedAt: '2023-02-24T19:20:30.338Z',
    },
  ];
}
