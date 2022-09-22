import { logFactory as parentLogFactory } from '../log-factory.conf'

export function logFactory() {
    return parentLogFactory().getChildFactory('common')
}
