import { BaseController } from '../../../presentation/Protocols/BaseController'
import Validator from '../../../libs/ApplicatonSchema/SchemaValidator'

const validator = new Validator()

BaseController._validator = validator