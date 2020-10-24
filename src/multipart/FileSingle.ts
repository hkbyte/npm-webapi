import { FormDataFile } from '.'
import _ from 'lodash'

type Validation = {
    optional?: boolean
    // allowTypes?: string[]
    // restrictTypes?: string[]
    // allowExtensions?: string[]
    // restrictExtensions?: string[]
}

export class FileSingle {
    validation: Validation

    constructor() {
        this.validation = {}
    }

    optional() {
        this.validation.optional = true
        return this
    }

    parse(payload: unknown): FormDataFile | undefined {
        if (Array.isArray(payload)) {
            throw new Error('Only single file required')
        }
        if (_.isUndefined(payload)) {
            if (!this.validation.optional) {
                throw new Error('required')
            }
        }
        return payload as FormDataFile
    }
}
