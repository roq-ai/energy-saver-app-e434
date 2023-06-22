import * as yup from 'yup';

export const residentialUserValidationSchema = yup.object().shape({
  energy_goal: yup.number().integer(),
  energy_usage: yup.number().integer(),
  user_id: yup.string().nullable().required(),
});
