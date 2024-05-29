import { CollectionConfig } from 'payload/types';
import Quote from '../blocks/Quote';
import Content from '../blocks/Content';
import Alert from '../blocks/Alert';

const AboutUs: CollectionConfig = {
  slug: 'about-us',
  admin: {
    defaultColumns: ['title', 'description'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Nội dung',
      type: 'textarea',
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
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Nội dung',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [Quote, Content, Alert],
            },
          ],
        },
      ],
    },
    // add sidebar fields here
  ],
};
export default AboutUs;
