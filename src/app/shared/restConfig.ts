import { baseURL } from './baseurl';

export function RestangularConfigFactory(RestangularProvider) {
    RestangularProvider.setBase(baseURL);
}