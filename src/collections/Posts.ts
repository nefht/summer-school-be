import { CollectionConfig } from 'payload/types';
import Quote from '../blocks/Quote';
import Content from '../blocks/Content';
import Alert from '../blocks/Alert';

const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Tin bài',
    plural: 'Tin bài',
  },
  admin: {
    defaultColumns: ['title', 'description', 'publishedDate'],
    useAsTitle: 'title',
    description: 'Trang quản lý tin bài',
    group: 'Quản lý',
  },
  access: {
    read: () => true,
  },

  // hooks: {
  //   beforeChange: [
  //     ({ data, originalDoc }) => {
  //       const now = new Date();

  //       // Nếu publishedDate nhỏ hơn hoặc bằng thời điểm hiện tại, status sẽ là 'published'
  //       if (data.publishedDate && new Date(data.publishedDate) <= now) {
  //         data.status = 'published';
  //       }
  //       // Nếu publishedDate lớn hơn thời điểm hiện tại, status sẽ là 'draft'
  //       else if (data.publishedDate && new Date(data.publishedDate) > now) {
  //         data.status = 'draft';
  //       }
  //       return data;
  //     },
  //   ],
  // },

  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      required: true,
    },
    {
      name: 'keywords',
      label: 'Từ khóa',
      type: 'text',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thêm ảnh tin bài',
          fields: [
            {
              name: 'postImages',
              label: 'Tải ảnh lên',
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
          label: 'Nội dung tin bài',
          fields: [
            {
              name: 'content',
              label: 'Nội dung',
              type: 'richText',
              // type: 'blocks',
              // blocks: [Quote, Content, Alert],
            },
          ],
        },
      ],
    },
    // add sidebar fields here
    {
      name: 'representImage',
      label: 'Ảnh Thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      options: [
        {
          value: 'draft',
          label: 'Draft',
        },
        {
          value: 'published',
          label: 'Published',
        },
      ],
      defaultValue: 'published',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      label: 'Ngày đăng',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
        condition: (data, originalDoc) => data.status == 'published',
      },
    },
    // {
    //   name: 'author',
    //   label: 'Tác giả',
    //   type: 'relationship',
    //   relationTo: 'users',
    //   hasMany: true,
    //   admin: {
    //     position: 'sidebar',
    //   },
    // },
  ],

  endpoints: [
    {
      path: '/published-all',
      method: 'get',
      handler: async (req, res) => {
        try {
          const response = await req.payload.find({
            collection: 'posts',
            where: {
              status: {
                equals: 'published',
              },
              publishedDate: {
                less_than_equal: new Date(),
              },
            },
            limit: 0,
          });
          res.status(200).send(response);
        } catch (error) {
          res.status(500).send({
            error: 'An error occurred while fetching the published posts',
          });
        }
      },
    },
    {
      path: '/published',
      method: 'get',
      handler: async (req, res) => {
        const { page = 1, limit = 10, search } = req.query;
        const parsedPage = parseInt(page as string, 10);
        const parsedLimit = parseInt(limit as string, 10);
        const searchCriteria = search
          ? {
              or: [
                {
                  title: {
                    contains: search,
                  },
                },
                {
                  description: {
                    contains: search,
                  },
                },
              ],
            }
          : {};

        try {
          const response = await req.payload.find({
            collection: 'posts',
            where: {
              status: {
                equals: 'published',
              },
              publishedDate: {
                less_than_equal: new Date(),
              },
              ...searchCriteria,
            },
            limit: parsedLimit,
            page: parsedPage,
            sort: '-publishedDate',
          });

          const totalDocuments = await req.payload.count({
            collection: 'posts',
            where: {
              status: {
                equals: 'published',
              },
              publishedDate: {
                less_than_equal: new Date(),
              },
              ...searchCriteria,
            },
          });

          const totalPages = Math.ceil(totalDocuments.totalDocs / parsedLimit);

          res.status(200).send({
            totalDocs: totalDocuments.totalDocs,
            totalPages,
            page: parsedPage,
            limit: parsedLimit,
            docs: response.docs,
          });
        } catch (error) {
          res.status(500).send({
            error: 'An error occurred while fetching the published posts',
          });
        }
      },
    },
  ],
};
export default Posts;
