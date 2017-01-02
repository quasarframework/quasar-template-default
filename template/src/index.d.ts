declare module "quasar"

declare module "*.vue" {
    const content: any
    export default content
}

// Defined in webpack DefinePlugin
declare var PROD: boolean
declare var DEV: boolean
declare var __THEME: string

declare function require(deps: string): any
declare function require(deps: string[], cb: any): any
