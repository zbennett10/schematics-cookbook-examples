import { Schema as ComponentOptions} from '@schematics/angular/component/schema';

export interface Schema extends ComponentOptions {
    name: string,
    service?: boolean
}
