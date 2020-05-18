import {
   startOfDay,
   endOfDay,
   setHours,
   setMinutes,
   setSeconds,
   format,
   isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
   async index(req, res) {
      const { date } = req.body;

      if (!date) {
         return res.status(400).json({ error: 'Invalid date.' });
      }

      const searchDate = Number(date);

      const appointments = await Appointment.findAll({
         where: {
            provider_id: req.params.providerId,
            canceled_at: null,
            date: {
               [Op.between]: [startOfDay(searchDate), endOfDay(parsedDate)],
            },
         },
      });

      const schedule = [
         '08:00', // 2020-05-18 08:00:00
         '09:00', // 2020-05-18 09:00:00
         '10:00',
         '11:00',
         '12:00',
         '14:00',
         '15:00',
         '16:00',
         '17:00',
         '18:00',
      ];

      const available = schedule.map((time) => {
         const [hour, minute] = time.split(':');
         const value = setSeconds(
            setMinutes(setHours(searchDate, hour), minute),
            0
         );

         return {
            time,
            value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
            available:
               isAfter(value, new Date()) &&
               !appointments.find((a) => format(a.date, 'HH:mm') === time),
         };
      });

      return res.json(available);
   }
}

export default new AvailableController();
