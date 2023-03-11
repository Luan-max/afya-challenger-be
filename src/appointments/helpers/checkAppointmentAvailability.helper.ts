export async function checkAppointmentAvailability(
  appointmentRepository: any,
  startDate: string,
  endDate: string,
): Promise<boolean> {
  const isAvailableForAppointment = await appointmentRepository
    .createQueryBuilder('appointment')
    .where('appointment.startDate = :date AND appointment.endDate = :end', {
      date: startDate,
      end: endDate,
    })
    .getOne();

  return !isAvailableForAppointment;
}
