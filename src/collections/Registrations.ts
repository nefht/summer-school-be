import { CollectionConfig } from 'payload/types';

const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy',
        },
      },
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'targetGroup',
      type: 'radio',
      options: [
        {
          label: 'Học sinh',
          value: 'pupil',
        },
        {
          label: 'Sinh viên',
          value: 'student',
        },
        {
          label: 'Người đi làm',
          value: 'working_person',
        },
      ],
      defaultValue: 'pupil',
      admin: {
        layout: 'horizontal',
      },
      required: true,
    },
    {
      name: 'schoolOrCompany',
      type: 'text',
      required: true,
    },
    {
      name: 'knowledgeLevel',
      type: 'radio',
      options: [
        {
          label: 'Chưa biết gì',
          value: '1',
        },
        {
          label: 'Tương đối hiểu biết',
          value: '2',
        },
        {
          label: 'Hiểu biết',
          value: '3',
        },
        {
          label: 'Chuyên gia',
          value: '4',
        },
      ],
      defaultValue: '1',
      admin: {
        layout: 'horizontal',
      },
      required: true,
    },
    {
      name: 'desiredOutcome',
      type: 'textarea',
      //   required: true,
    },
  ],
};

export default Registrations;
