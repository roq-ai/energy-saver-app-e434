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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createResidentialUser } from 'apiSdk/residential-users';
import { Error } from 'components/error';
import { residentialUserValidationSchema } from 'validationSchema/residential-users';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { ResidentialUserInterface } from 'interfaces/residential-user';

function ResidentialUserCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ResidentialUserInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createResidentialUser(values);
      resetForm();
      router.push('/residential-users');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ResidentialUserInterface>({
    initialValues: {
      energy_goal: 0,
      energy_usage: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
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
            Create Residential User
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'residential_user',
  operation: AccessOperationEnum.CREATE,
})(ResidentialUserCreatePage);
