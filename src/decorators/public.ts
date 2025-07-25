import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@src/constants';

export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
