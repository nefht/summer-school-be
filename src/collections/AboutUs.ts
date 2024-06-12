import { CollectionConfig } from 'payload/types';
import Quote from '../blocks/Quote';
import Content from '../blocks/Content';
import Alert from '../blocks/Alert';

const AboutUs: CollectionConfig = {
  slug: 'about-us',
  labels: {
    singular: 'Giới thiệu',
    plural: 'Giới thiệu',
  },
  admin: {
    defaultColumns: ['title', 'description'],
    useAsTitle: 'title',
    group: 'Quản lý',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      label: 'Mô tả giới thiệu',
      type: 'richText',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ảnh',
          fields: [
            {
              name: 'postImages',
              label: 'Đăng tải ảnh',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  label: 'Ảnh',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    // add sidebar fields here
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'phone',
      label: 'Số điện thoại',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'workingTime',
      label: 'Thời gian làm việc',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
export default AboutUs;
