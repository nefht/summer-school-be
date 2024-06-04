import payload from 'payload';
import { CollectionConfig } from 'payload/types';

const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: {
    singular: 'Đơn đăng ký',
    plural: 'Đơn đăng ký',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Trang quản trị',
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Họ và tên',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      label: 'Giới tính',
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
      label: 'Ngày sinh',
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
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'targetGroup',
      label: 'Đối tượng',
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
      label: 'Trường học/Công ty',
      type: 'text',
      required: true,
    },
    {
      name: 'knowledgeLevel',
      label: 'Mức hiểu biết về chủ đề',
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
      label: 'Mong muốn thu hoạch',
      type: 'textarea',
      //   required: true,
    },
    // Trạng thái đăng ký
    {
      name: 'status',
      label: 'Trạng thái đăng ký',
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

  // hooks: {
  //   afterChange: [
  //     async ({ doc }) => {
  //       // Gửi email xác nhận sau khi tạo mới
  //       await sendConfirmationEmail(doc);
  //     },
  //   ],
  // },

  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        console.log(doc);

        if (operation === 'create') {
          const confirmUrl = `${process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL}/api/registrations/confirm-registration/${doc.id}`;
          const cancelmUrl = `${process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL}/api/registrations/cancel-registration/${doc.id}`;
          payload.sendEmail({
            to: doc.email,
            from: process.env.EMAIL_USER,
            subject: 'Xác nhận đăng ký khóa học SUMMER SCHOOL',
            html: `
              <div style="width: 600px; margin: 0 auto;">
                <div>
                  <h1>SUMMER SCHOOL - Xác nhận đăng ký khóa học</h1>
                  <p>Xin chào ${doc.name},</p>

                  <p>Chúng tôi đã nhận được đơn đăng ký khóa học hè của bạn. Vui lòng bấm vào đường link sau để xác nhận đăng ký:</p>
                  <a href=${confirmUrl}>Xác nhận</a>
                  <p>Hoặc bấm vào đường link sau để hủy bỏ đăng ký:</p>
                  <a href=${cancelmUrl}>Hủy bỏ</a>
                  <br/>
                  <br/>
                  <b>Cảm ơn bạn vì đã quan tâm đến khóa học của chúng tôi.</b>
                </div>

                <div>
                  <p>Summer School Team</p>
                </div>
              </div>
            `,
          });
        }
      },
    ],
  },

  // ĐỊNH NGHĨA CÁC CUSTOM APIs
  endpoints: [
    // Đếm số lượng Registrations đã được confirmed
    {
      path: '/count-confirmed',
      method: 'get',
      handler: async (req, res) => {
        try {
          const response = await req.payload.find({
            collection: 'registrations',
            where: {
              status: {
                equals: 'confirmed',
              },
            },
            limit: 0,
          });
          res.status(200).send({ count: response.totalDocs });
        } catch (error) {
          res
            .status(500)
            .send({ error: 'An error occurred while fetching the count' });
        }
      },
    },

    // Đếm số lượng Registrations đã được cancelled
    {
      path: '/count-cancelled',
      method: 'get',
      handler: async (req, res) => {
        try {
          const response = await req.payload.find({
            collection: 'registrations',
            where: {
              status: {
                equals: 'cancelled',
              },
            },
            limit: 0,
          });
          res.status(200).send({ count: response.totalDocs });
        } catch (error) {
          res
            .status(500)
            .send({ error: 'An error occurred while fetching the count' });
        }
      },
    },

    // Get các bản ghi đã được confirmed
    {
      path: '/confirmed',
      method: 'get',
      handler: async (req, res) => {
        try {
          const response = await req.payload.find({
            collection: 'registrations',
            where: {
              status: {
                equals: 'confirmed',
              },
            },
            limit: 0,
          });
          res.status(200).send(response);
        } catch (error) {
          res
            .status(500)
            .send({ error: 'An error occurred while fetching the count' });
        }
      },
    },

    // Xác nhận đăng ký
    {
      path: '/confirm-registration/:id',
      method: 'get',
      handler: async (req, res) => {
        const { id } = req.params;
        try {
          await req.payload.update({
            collection: 'registrations',
            id,
            data: { status: 'confirmed' },
          });
          res.status(200).send('Registration confirmed successfully');
        } catch (error) {
          res.status(500).send({
            error: 'An error occurred while confirming the registration',
          });
        }
      },
    },

    // Hủy bỏ đăng ký
    {
      path: '/cancel-registration/:id',
      method: 'get',
      handler: async (req, res) => {
        const { id } = req.params;
        try {
          await req.payload.update({
            collection: 'registrations',
            id,
            data: { status: 'cancelled' },
          });
          res.status(200).send('Registration cancelled successfully');
        } catch (error) {
          res.status(500).send({
            error: 'An error occurred while cancelling the registration',
          });
        }
      },
    },

    // Đếm số lượng Knowledge Levels
    {
      path: '/count-knowledge-levels',
      method: 'get',
      handler: async (req, res) => {
        try {
          const counts = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
          };

          const response = await req.payload.find({
            collection: 'registrations',
            limit: 0,
          });

          console.log(response);

          response.docs.forEach((registration) => {
            if (registration.knowledgeLevel == '1') {
              counts['1']++;
            }
            if (registration.knowledgeLevel == '2') {
              counts['2']++;
            }
            if (registration.knowledgeLevel == '3') {
              counts['3']++;
            }
            if (registration.knowledgeLevel == '4') {
              counts['4']++;
            }
          });

          res.status(200).send(counts);
        } catch (error) {
          res
            .status(500)
            .send({ error: 'An error occurred while fetching the counts' });
        }
      },
    },
  ],
};

export default Registrations;
