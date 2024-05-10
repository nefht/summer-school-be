import { CollectionConfig } from 'payload/types';

const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      type: 'radio',
      options: [
        {
          label: 'Nam',
          value: 'male',
        },
        {
          label: 'Nữ',
          value: 'female',
        },
      ],
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
      name: 'expectation',
      type: 'textarea',
      //   required: true,
    },
    // Trạng thái đăng ký
    {
      name: 'status',
      type: 'radio',
      options: [
        {
          label: 'Chưa xác nhận',
          value: 'unconfirmed',
        },
        {
          label: 'Đã xác nhận',
          value: 'confirmed',
        },
        {
          label: 'Đã hủy',
          value: 'cancelled',
        },
      ],
      defaultValue: 'unconfirmed',
      admin: {
        layout: 'horizontal',
      },
      // required: true,
    },
  ],
};

export default Registrations;
