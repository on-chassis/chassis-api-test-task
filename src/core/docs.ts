import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';

import { AnswerModule } from '../answer/answer.module';
import { AuthModule } from '../auth/auth.module';
import { PollModule } from '../poll/poll.module';
import { UsersModule } from '../users/users.module';
import { DOCS_TITLE, DOCS_DESCRIPTION } from './docs.static';

const { DOCS_VERSION, DOCS_ADMIN_USERNAME, DOCS_ADMIN_PASSWORD } = process.env;

export async function setupApiDocs(app: NestExpressApplication): Promise<any> {
  const options = new DocumentBuilder()
    .setVersion(DOCS_VERSION)
    .setTitle(DOCS_TITLE)
    .setDescription(DOCS_DESCRIPTION)
    .addSecurityRequirements('bearer')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [AuthModule, UsersModule, PollModule, AnswerModule],
  });
  const redocOptions: RedocOptions = {
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    showExtensions: true,
    nativeScrollbars: true,
    auth: {
      enabled: true,
      user: DOCS_ADMIN_USERNAME,
      password: DOCS_ADMIN_PASSWORD,
    },
  };
  await RedocModule.setup('docs', app, document, redocOptions);
}
