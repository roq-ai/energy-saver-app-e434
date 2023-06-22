import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getResidentialUserById, updateResidentialUserById } from 'apiSdk/residential-users';
import { Error } from 'components/error';
import { residentialUserValidationSchema } from 'validationSchema/residential-users';
import { ResidentialUserInterface } from 'interfaces/residential-user';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function ResidentialUserEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ResidentialUserInterface>(
    () => (id ? `/residential-users/${id}` : null),
    () => getResidentialUserById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ResidentialUserInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateResidentialUserById(id, values);
      mutate(updated);
      resetForm();
      router.push('/residential-users');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ResidentialUserInterface>({
    initialValues: data,
    validationSchema: residentialUserValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Residential User
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="energy_goal" mb="4" isInvalid={!!formik.errors?.energy_goal}>
              <FormLabel>Energy Goal</FormLabel>
              <NumberInput
                name="energy_goal"
                value={formik.values?.energy_goal}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('energy_goal', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.energy_goal && <FormErrorMessage>{formik.errors?.energy_goal}</FormErrorMessage>}
            </FormControl>
            <FormControl id="energy_usage" mb="4" isInvalid={!!formik.errors?.energy_usage}>
              <FormLabel>Energy Usage</FormLabel>
              <NumberInput
                name="energy_usage"
                value={formik.values?.energy_usage}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('energy_usage', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.energy_usage && <FormErrorMessage>{formik.errors?.energy_usage}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'residential_user',
  operation: AccessOperationEnum.UPDATE,
})(ResidentialUserEditPage);
