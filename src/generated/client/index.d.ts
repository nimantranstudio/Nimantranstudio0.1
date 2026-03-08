
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model OTPRequest
 * 
 */
export type OTPRequest = $Result.DefaultSelection<Prisma.$OTPRequestPayload>
/**
 * Model Bundle
 * 
 */
export type Bundle = $Result.DefaultSelection<Prisma.$BundlePayload>
/**
 * Model BundleItem
 * 
 */
export type BundleItem = $Result.DefaultSelection<Prisma.$BundleItemPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model Theme
 * 
 */
export type Theme = $Result.DefaultSelection<Prisma.$ThemePayload>
/**
 * Model Wedding
 * 
 */
export type Wedding = $Result.DefaultSelection<Prisma.$WeddingPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model RSVP
 * 
 */
export type RSVP = $Result.DefaultSelection<Prisma.$RSVPPayload>
/**
 * Model Package
 * 
 */
export type Package = $Result.DefaultSelection<Prisma.$PackagePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.oTPRequest`: Exposes CRUD operations for the **OTPRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OTPRequests
    * const oTPRequests = await prisma.oTPRequest.findMany()
    * ```
    */
  get oTPRequest(): Prisma.OTPRequestDelegate<ExtArgs>;

  /**
   * `prisma.bundle`: Exposes CRUD operations for the **Bundle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bundles
    * const bundles = await prisma.bundle.findMany()
    * ```
    */
  get bundle(): Prisma.BundleDelegate<ExtArgs>;

  /**
   * `prisma.bundleItem`: Exposes CRUD operations for the **BundleItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BundleItems
    * const bundleItems = await prisma.bundleItem.findMany()
    * ```
    */
  get bundleItem(): Prisma.BundleItemDelegate<ExtArgs>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs>;

  /**
   * `prisma.theme`: Exposes CRUD operations for the **Theme** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Themes
    * const themes = await prisma.theme.findMany()
    * ```
    */
  get theme(): Prisma.ThemeDelegate<ExtArgs>;

  /**
   * `prisma.wedding`: Exposes CRUD operations for the **Wedding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Weddings
    * const weddings = await prisma.wedding.findMany()
    * ```
    */
  get wedding(): Prisma.WeddingDelegate<ExtArgs>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs>;

  /**
   * `prisma.rSVP`: Exposes CRUD operations for the **RSVP** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RSVPS
    * const rSVPS = await prisma.rSVP.findMany()
    * ```
    */
  get rSVP(): Prisma.RSVPDelegate<ExtArgs>;

  /**
   * `prisma.package`: Exposes CRUD operations for the **Package** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Packages
    * const packages = await prisma.package.findMany()
    * ```
    */
  get package(): Prisma.PackageDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    OTPRequest: 'OTPRequest',
    Bundle: 'Bundle',
    BundleItem: 'BundleItem',
    Order: 'Order',
    Theme: 'Theme',
    Wedding: 'Wedding',
    Event: 'Event',
    RSVP: 'RSVP',
    Package: 'Package'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "oTPRequest" | "bundle" | "bundleItem" | "order" | "theme" | "wedding" | "event" | "rSVP" | "package"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      OTPRequest: {
        payload: Prisma.$OTPRequestPayload<ExtArgs>
        fields: Prisma.OTPRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OTPRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OTPRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload>
          }
          findFirst: {
            args: Prisma.OTPRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OTPRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload>
          }
          findMany: {
            args: Prisma.OTPRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload>[]
          }
          create: {
            args: Prisma.OTPRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload>
          }
          createMany: {
            args: Prisma.OTPRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OTPRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload>[]
          }
          delete: {
            args: Prisma.OTPRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload>
          }
          update: {
            args: Prisma.OTPRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload>
          }
          deleteMany: {
            args: Prisma.OTPRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OTPRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OTPRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPRequestPayload>
          }
          aggregate: {
            args: Prisma.OTPRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOTPRequest>
          }
          groupBy: {
            args: Prisma.OTPRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<OTPRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.OTPRequestCountArgs<ExtArgs>
            result: $Utils.Optional<OTPRequestCountAggregateOutputType> | number
          }
        }
      }
      Bundle: {
        payload: Prisma.$BundlePayload<ExtArgs>
        fields: Prisma.BundleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BundleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BundleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          findFirst: {
            args: Prisma.BundleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BundleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          findMany: {
            args: Prisma.BundleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>[]
          }
          create: {
            args: Prisma.BundleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          createMany: {
            args: Prisma.BundleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BundleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>[]
          }
          delete: {
            args: Prisma.BundleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          update: {
            args: Prisma.BundleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          deleteMany: {
            args: Prisma.BundleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BundleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BundleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          aggregate: {
            args: Prisma.BundleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBundle>
          }
          groupBy: {
            args: Prisma.BundleGroupByArgs<ExtArgs>
            result: $Utils.Optional<BundleGroupByOutputType>[]
          }
          count: {
            args: Prisma.BundleCountArgs<ExtArgs>
            result: $Utils.Optional<BundleCountAggregateOutputType> | number
          }
        }
      }
      BundleItem: {
        payload: Prisma.$BundleItemPayload<ExtArgs>
        fields: Prisma.BundleItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BundleItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BundleItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload>
          }
          findFirst: {
            args: Prisma.BundleItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BundleItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload>
          }
          findMany: {
            args: Prisma.BundleItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload>[]
          }
          create: {
            args: Prisma.BundleItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload>
          }
          createMany: {
            args: Prisma.BundleItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BundleItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload>[]
          }
          delete: {
            args: Prisma.BundleItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload>
          }
          update: {
            args: Prisma.BundleItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload>
          }
          deleteMany: {
            args: Prisma.BundleItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BundleItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BundleItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundleItemPayload>
          }
          aggregate: {
            args: Prisma.BundleItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBundleItem>
          }
          groupBy: {
            args: Prisma.BundleItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<BundleItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.BundleItemCountArgs<ExtArgs>
            result: $Utils.Optional<BundleItemCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      Theme: {
        payload: Prisma.$ThemePayload<ExtArgs>
        fields: Prisma.ThemeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ThemeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ThemeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          findFirst: {
            args: Prisma.ThemeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ThemeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          findMany: {
            args: Prisma.ThemeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>[]
          }
          create: {
            args: Prisma.ThemeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          createMany: {
            args: Prisma.ThemeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ThemeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>[]
          }
          delete: {
            args: Prisma.ThemeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          update: {
            args: Prisma.ThemeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          deleteMany: {
            args: Prisma.ThemeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ThemeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ThemeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          aggregate: {
            args: Prisma.ThemeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTheme>
          }
          groupBy: {
            args: Prisma.ThemeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ThemeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ThemeCountArgs<ExtArgs>
            result: $Utils.Optional<ThemeCountAggregateOutputType> | number
          }
        }
      }
      Wedding: {
        payload: Prisma.$WeddingPayload<ExtArgs>
        fields: Prisma.WeddingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeddingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeddingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          findFirst: {
            args: Prisma.WeddingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeddingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          findMany: {
            args: Prisma.WeddingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>[]
          }
          create: {
            args: Prisma.WeddingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          createMany: {
            args: Prisma.WeddingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeddingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>[]
          }
          delete: {
            args: Prisma.WeddingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          update: {
            args: Prisma.WeddingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          deleteMany: {
            args: Prisma.WeddingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeddingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WeddingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          aggregate: {
            args: Prisma.WeddingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWedding>
          }
          groupBy: {
            args: Prisma.WeddingGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeddingGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeddingCountArgs<ExtArgs>
            result: $Utils.Optional<WeddingCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      RSVP: {
        payload: Prisma.$RSVPPayload<ExtArgs>
        fields: Prisma.RSVPFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RSVPFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RSVPFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload>
          }
          findFirst: {
            args: Prisma.RSVPFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RSVPFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload>
          }
          findMany: {
            args: Prisma.RSVPFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload>[]
          }
          create: {
            args: Prisma.RSVPCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload>
          }
          createMany: {
            args: Prisma.RSVPCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RSVPCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload>[]
          }
          delete: {
            args: Prisma.RSVPDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload>
          }
          update: {
            args: Prisma.RSVPUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload>
          }
          deleteMany: {
            args: Prisma.RSVPDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RSVPUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RSVPUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RSVPPayload>
          }
          aggregate: {
            args: Prisma.RSVPAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRSVP>
          }
          groupBy: {
            args: Prisma.RSVPGroupByArgs<ExtArgs>
            result: $Utils.Optional<RSVPGroupByOutputType>[]
          }
          count: {
            args: Prisma.RSVPCountArgs<ExtArgs>
            result: $Utils.Optional<RSVPCountAggregateOutputType> | number
          }
        }
      }
      Package: {
        payload: Prisma.$PackagePayload<ExtArgs>
        fields: Prisma.PackageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PackageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PackageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          findFirst: {
            args: Prisma.PackageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PackageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          findMany: {
            args: Prisma.PackageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>[]
          }
          create: {
            args: Prisma.PackageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          createMany: {
            args: Prisma.PackageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PackageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>[]
          }
          delete: {
            args: Prisma.PackageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          update: {
            args: Prisma.PackageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          deleteMany: {
            args: Prisma.PackageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PackageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PackageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          aggregate: {
            args: Prisma.PackageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePackage>
          }
          groupBy: {
            args: Prisma.PackageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PackageGroupByOutputType>[]
          }
          count: {
            args: Prisma.PackageCountArgs<ExtArgs>
            result: $Utils.Optional<PackageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    orders: number
    weddings: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | UserCountOutputTypeCountOrdersArgs
    weddings?: boolean | UserCountOutputTypeCountWeddingsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingWhereInput
  }


  /**
   * Count Type BundleCountOutputType
   */

  export type BundleCountOutputType = {
    orders: number
    bundleItems: number
  }

  export type BundleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | BundleCountOutputTypeCountOrdersArgs
    bundleItems?: boolean | BundleCountOutputTypeCountBundleItemsArgs
  }

  // Custom InputTypes
  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleCountOutputType
     */
    select?: BundleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeCountBundleItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundleItemWhereInput
  }


  /**
   * Count Type ThemeCountOutputType
   */

  export type ThemeCountOutputType = {
    bundles: number
    weddings: number
  }

  export type ThemeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundles?: boolean | ThemeCountOutputTypeCountBundlesArgs
    weddings?: boolean | ThemeCountOutputTypeCountWeddingsArgs
  }

  // Custom InputTypes
  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeCountOutputType
     */
    select?: ThemeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeCountBundlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundleWhereInput
  }

  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeCountWeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingWhereInput
  }


  /**
   * Count Type WeddingCountOutputType
   */

  export type WeddingCountOutputType = {
    events: number
    rsvps: number
  }

  export type WeddingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | WeddingCountOutputTypeCountEventsArgs
    rsvps?: boolean | WeddingCountOutputTypeCountRsvpsArgs
  }

  // Custom InputTypes
  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingCountOutputType
     */
    select?: WeddingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }

  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeCountRsvpsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RSVPWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isMobileVerified: boolean | null
    mobileNumber: string | null
    role: string | null
    status: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isMobileVerified: boolean | null
    mobileNumber: string | null
    role: string | null
    status: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    createdAt: number
    updatedAt: number
    isMobileVerified: number
    mobileNumber: number
    role: number
    status: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    isMobileVerified?: true
    mobileNumber?: true
    role?: true
    status?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    isMobileVerified?: true
    mobileNumber?: true
    role?: true
    status?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    isMobileVerified?: true
    mobileNumber?: true
    role?: true
    status?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string | null
    name: string | null
    createdAt: Date
    updatedAt: Date
    isMobileVerified: boolean
    mobileNumber: string
    role: string
    status: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isMobileVerified?: boolean
    mobileNumber?: boolean
    role?: boolean
    status?: boolean
    orders?: boolean | User$ordersArgs<ExtArgs>
    weddings?: boolean | User$weddingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isMobileVerified?: boolean
    mobileNumber?: boolean
    role?: boolean
    status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isMobileVerified?: boolean
    mobileNumber?: boolean
    role?: boolean
    status?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | User$ordersArgs<ExtArgs>
    weddings?: boolean | User$weddingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      orders: Prisma.$OrderPayload<ExtArgs>[]
      weddings: Prisma.$WeddingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      name: string | null
      createdAt: Date
      updatedAt: Date
      isMobileVerified: boolean
      mobileNumber: string
      role: string
      status: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orders<T extends User$ordersArgs<ExtArgs> = {}>(args?: Subset<T, User$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany"> | Null>
    weddings<T extends User$weddingsArgs<ExtArgs> = {}>(args?: Subset<T, User$weddingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly isMobileVerified: FieldRef<"User", 'Boolean'>
    readonly mobileNumber: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.orders
   */
  export type User$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User.weddings
   */
  export type User$weddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    where?: WeddingWhereInput
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    cursor?: WeddingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeddingScalarFieldEnum | WeddingScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model OTPRequest
   */

  export type AggregateOTPRequest = {
    _count: OTPRequestCountAggregateOutputType | null
    _avg: OTPRequestAvgAggregateOutputType | null
    _sum: OTPRequestSumAggregateOutputType | null
    _min: OTPRequestMinAggregateOutputType | null
    _max: OTPRequestMaxAggregateOutputType | null
  }

  export type OTPRequestAvgAggregateOutputType = {
    attemptCount: number | null
  }

  export type OTPRequestSumAggregateOutputType = {
    attemptCount: number | null
  }

  export type OTPRequestMinAggregateOutputType = {
    id: string | null
    mobileNumber: string | null
    otpHash: string | null
    expiresAt: Date | null
    isUsed: boolean | null
    attemptCount: number | null
    createdAt: Date | null
  }

  export type OTPRequestMaxAggregateOutputType = {
    id: string | null
    mobileNumber: string | null
    otpHash: string | null
    expiresAt: Date | null
    isUsed: boolean | null
    attemptCount: number | null
    createdAt: Date | null
  }

  export type OTPRequestCountAggregateOutputType = {
    id: number
    mobileNumber: number
    otpHash: number
    expiresAt: number
    isUsed: number
    attemptCount: number
    createdAt: number
    _all: number
  }


  export type OTPRequestAvgAggregateInputType = {
    attemptCount?: true
  }

  export type OTPRequestSumAggregateInputType = {
    attemptCount?: true
  }

  export type OTPRequestMinAggregateInputType = {
    id?: true
    mobileNumber?: true
    otpHash?: true
    expiresAt?: true
    isUsed?: true
    attemptCount?: true
    createdAt?: true
  }

  export type OTPRequestMaxAggregateInputType = {
    id?: true
    mobileNumber?: true
    otpHash?: true
    expiresAt?: true
    isUsed?: true
    attemptCount?: true
    createdAt?: true
  }

  export type OTPRequestCountAggregateInputType = {
    id?: true
    mobileNumber?: true
    otpHash?: true
    expiresAt?: true
    isUsed?: true
    attemptCount?: true
    createdAt?: true
    _all?: true
  }

  export type OTPRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OTPRequest to aggregate.
     */
    where?: OTPRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPRequests to fetch.
     */
    orderBy?: OTPRequestOrderByWithRelationInput | OTPRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OTPRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OTPRequests
    **/
    _count?: true | OTPRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OTPRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OTPRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OTPRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OTPRequestMaxAggregateInputType
  }

  export type GetOTPRequestAggregateType<T extends OTPRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateOTPRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOTPRequest[P]>
      : GetScalarType<T[P], AggregateOTPRequest[P]>
  }




  export type OTPRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OTPRequestWhereInput
    orderBy?: OTPRequestOrderByWithAggregationInput | OTPRequestOrderByWithAggregationInput[]
    by: OTPRequestScalarFieldEnum[] | OTPRequestScalarFieldEnum
    having?: OTPRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OTPRequestCountAggregateInputType | true
    _avg?: OTPRequestAvgAggregateInputType
    _sum?: OTPRequestSumAggregateInputType
    _min?: OTPRequestMinAggregateInputType
    _max?: OTPRequestMaxAggregateInputType
  }

  export type OTPRequestGroupByOutputType = {
    id: string
    mobileNumber: string
    otpHash: string
    expiresAt: Date
    isUsed: boolean
    attemptCount: number
    createdAt: Date
    _count: OTPRequestCountAggregateOutputType | null
    _avg: OTPRequestAvgAggregateOutputType | null
    _sum: OTPRequestSumAggregateOutputType | null
    _min: OTPRequestMinAggregateOutputType | null
    _max: OTPRequestMaxAggregateOutputType | null
  }

  type GetOTPRequestGroupByPayload<T extends OTPRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OTPRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OTPRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OTPRequestGroupByOutputType[P]>
            : GetScalarType<T[P], OTPRequestGroupByOutputType[P]>
        }
      >
    >


  export type OTPRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mobileNumber?: boolean
    otpHash?: boolean
    expiresAt?: boolean
    isUsed?: boolean
    attemptCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["oTPRequest"]>

  export type OTPRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mobileNumber?: boolean
    otpHash?: boolean
    expiresAt?: boolean
    isUsed?: boolean
    attemptCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["oTPRequest"]>

  export type OTPRequestSelectScalar = {
    id?: boolean
    mobileNumber?: boolean
    otpHash?: boolean
    expiresAt?: boolean
    isUsed?: boolean
    attemptCount?: boolean
    createdAt?: boolean
  }


  export type $OTPRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OTPRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      mobileNumber: string
      otpHash: string
      expiresAt: Date
      isUsed: boolean
      attemptCount: number
      createdAt: Date
    }, ExtArgs["result"]["oTPRequest"]>
    composites: {}
  }

  type OTPRequestGetPayload<S extends boolean | null | undefined | OTPRequestDefaultArgs> = $Result.GetResult<Prisma.$OTPRequestPayload, S>

  type OTPRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OTPRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OTPRequestCountAggregateInputType | true
    }

  export interface OTPRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OTPRequest'], meta: { name: 'OTPRequest' } }
    /**
     * Find zero or one OTPRequest that matches the filter.
     * @param {OTPRequestFindUniqueArgs} args - Arguments to find a OTPRequest
     * @example
     * // Get one OTPRequest
     * const oTPRequest = await prisma.oTPRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OTPRequestFindUniqueArgs>(args: SelectSubset<T, OTPRequestFindUniqueArgs<ExtArgs>>): Prisma__OTPRequestClient<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OTPRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OTPRequestFindUniqueOrThrowArgs} args - Arguments to find a OTPRequest
     * @example
     * // Get one OTPRequest
     * const oTPRequest = await prisma.oTPRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OTPRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, OTPRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OTPRequestClient<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OTPRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPRequestFindFirstArgs} args - Arguments to find a OTPRequest
     * @example
     * // Get one OTPRequest
     * const oTPRequest = await prisma.oTPRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OTPRequestFindFirstArgs>(args?: SelectSubset<T, OTPRequestFindFirstArgs<ExtArgs>>): Prisma__OTPRequestClient<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OTPRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPRequestFindFirstOrThrowArgs} args - Arguments to find a OTPRequest
     * @example
     * // Get one OTPRequest
     * const oTPRequest = await prisma.oTPRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OTPRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, OTPRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__OTPRequestClient<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OTPRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OTPRequests
     * const oTPRequests = await prisma.oTPRequest.findMany()
     * 
     * // Get first 10 OTPRequests
     * const oTPRequests = await prisma.oTPRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oTPRequestWithIdOnly = await prisma.oTPRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OTPRequestFindManyArgs>(args?: SelectSubset<T, OTPRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OTPRequest.
     * @param {OTPRequestCreateArgs} args - Arguments to create a OTPRequest.
     * @example
     * // Create one OTPRequest
     * const OTPRequest = await prisma.oTPRequest.create({
     *   data: {
     *     // ... data to create a OTPRequest
     *   }
     * })
     * 
     */
    create<T extends OTPRequestCreateArgs>(args: SelectSubset<T, OTPRequestCreateArgs<ExtArgs>>): Prisma__OTPRequestClient<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OTPRequests.
     * @param {OTPRequestCreateManyArgs} args - Arguments to create many OTPRequests.
     * @example
     * // Create many OTPRequests
     * const oTPRequest = await prisma.oTPRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OTPRequestCreateManyArgs>(args?: SelectSubset<T, OTPRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OTPRequests and returns the data saved in the database.
     * @param {OTPRequestCreateManyAndReturnArgs} args - Arguments to create many OTPRequests.
     * @example
     * // Create many OTPRequests
     * const oTPRequest = await prisma.oTPRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OTPRequests and only return the `id`
     * const oTPRequestWithIdOnly = await prisma.oTPRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OTPRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, OTPRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OTPRequest.
     * @param {OTPRequestDeleteArgs} args - Arguments to delete one OTPRequest.
     * @example
     * // Delete one OTPRequest
     * const OTPRequest = await prisma.oTPRequest.delete({
     *   where: {
     *     // ... filter to delete one OTPRequest
     *   }
     * })
     * 
     */
    delete<T extends OTPRequestDeleteArgs>(args: SelectSubset<T, OTPRequestDeleteArgs<ExtArgs>>): Prisma__OTPRequestClient<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OTPRequest.
     * @param {OTPRequestUpdateArgs} args - Arguments to update one OTPRequest.
     * @example
     * // Update one OTPRequest
     * const oTPRequest = await prisma.oTPRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OTPRequestUpdateArgs>(args: SelectSubset<T, OTPRequestUpdateArgs<ExtArgs>>): Prisma__OTPRequestClient<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OTPRequests.
     * @param {OTPRequestDeleteManyArgs} args - Arguments to filter OTPRequests to delete.
     * @example
     * // Delete a few OTPRequests
     * const { count } = await prisma.oTPRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OTPRequestDeleteManyArgs>(args?: SelectSubset<T, OTPRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OTPRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OTPRequests
     * const oTPRequest = await prisma.oTPRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OTPRequestUpdateManyArgs>(args: SelectSubset<T, OTPRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OTPRequest.
     * @param {OTPRequestUpsertArgs} args - Arguments to update or create a OTPRequest.
     * @example
     * // Update or create a OTPRequest
     * const oTPRequest = await prisma.oTPRequest.upsert({
     *   create: {
     *     // ... data to create a OTPRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OTPRequest we want to update
     *   }
     * })
     */
    upsert<T extends OTPRequestUpsertArgs>(args: SelectSubset<T, OTPRequestUpsertArgs<ExtArgs>>): Prisma__OTPRequestClient<$Result.GetResult<Prisma.$OTPRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OTPRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPRequestCountArgs} args - Arguments to filter OTPRequests to count.
     * @example
     * // Count the number of OTPRequests
     * const count = await prisma.oTPRequest.count({
     *   where: {
     *     // ... the filter for the OTPRequests we want to count
     *   }
     * })
    **/
    count<T extends OTPRequestCountArgs>(
      args?: Subset<T, OTPRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OTPRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OTPRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OTPRequestAggregateArgs>(args: Subset<T, OTPRequestAggregateArgs>): Prisma.PrismaPromise<GetOTPRequestAggregateType<T>>

    /**
     * Group by OTPRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OTPRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OTPRequestGroupByArgs['orderBy'] }
        : { orderBy?: OTPRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OTPRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOTPRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OTPRequest model
   */
  readonly fields: OTPRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OTPRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OTPRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OTPRequest model
   */ 
  interface OTPRequestFieldRefs {
    readonly id: FieldRef<"OTPRequest", 'String'>
    readonly mobileNumber: FieldRef<"OTPRequest", 'String'>
    readonly otpHash: FieldRef<"OTPRequest", 'String'>
    readonly expiresAt: FieldRef<"OTPRequest", 'DateTime'>
    readonly isUsed: FieldRef<"OTPRequest", 'Boolean'>
    readonly attemptCount: FieldRef<"OTPRequest", 'Int'>
    readonly createdAt: FieldRef<"OTPRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OTPRequest findUnique
   */
  export type OTPRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * Filter, which OTPRequest to fetch.
     */
    where: OTPRequestWhereUniqueInput
  }

  /**
   * OTPRequest findUniqueOrThrow
   */
  export type OTPRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * Filter, which OTPRequest to fetch.
     */
    where: OTPRequestWhereUniqueInput
  }

  /**
   * OTPRequest findFirst
   */
  export type OTPRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * Filter, which OTPRequest to fetch.
     */
    where?: OTPRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPRequests to fetch.
     */
    orderBy?: OTPRequestOrderByWithRelationInput | OTPRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OTPRequests.
     */
    cursor?: OTPRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OTPRequests.
     */
    distinct?: OTPRequestScalarFieldEnum | OTPRequestScalarFieldEnum[]
  }

  /**
   * OTPRequest findFirstOrThrow
   */
  export type OTPRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * Filter, which OTPRequest to fetch.
     */
    where?: OTPRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPRequests to fetch.
     */
    orderBy?: OTPRequestOrderByWithRelationInput | OTPRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OTPRequests.
     */
    cursor?: OTPRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OTPRequests.
     */
    distinct?: OTPRequestScalarFieldEnum | OTPRequestScalarFieldEnum[]
  }

  /**
   * OTPRequest findMany
   */
  export type OTPRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * Filter, which OTPRequests to fetch.
     */
    where?: OTPRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPRequests to fetch.
     */
    orderBy?: OTPRequestOrderByWithRelationInput | OTPRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OTPRequests.
     */
    cursor?: OTPRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPRequests.
     */
    skip?: number
    distinct?: OTPRequestScalarFieldEnum | OTPRequestScalarFieldEnum[]
  }

  /**
   * OTPRequest create
   */
  export type OTPRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * The data needed to create a OTPRequest.
     */
    data: XOR<OTPRequestCreateInput, OTPRequestUncheckedCreateInput>
  }

  /**
   * OTPRequest createMany
   */
  export type OTPRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OTPRequests.
     */
    data: OTPRequestCreateManyInput | OTPRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OTPRequest createManyAndReturn
   */
  export type OTPRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OTPRequests.
     */
    data: OTPRequestCreateManyInput | OTPRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OTPRequest update
   */
  export type OTPRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * The data needed to update a OTPRequest.
     */
    data: XOR<OTPRequestUpdateInput, OTPRequestUncheckedUpdateInput>
    /**
     * Choose, which OTPRequest to update.
     */
    where: OTPRequestWhereUniqueInput
  }

  /**
   * OTPRequest updateMany
   */
  export type OTPRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OTPRequests.
     */
    data: XOR<OTPRequestUpdateManyMutationInput, OTPRequestUncheckedUpdateManyInput>
    /**
     * Filter which OTPRequests to update
     */
    where?: OTPRequestWhereInput
  }

  /**
   * OTPRequest upsert
   */
  export type OTPRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * The filter to search for the OTPRequest to update in case it exists.
     */
    where: OTPRequestWhereUniqueInput
    /**
     * In case the OTPRequest found by the `where` argument doesn't exist, create a new OTPRequest with this data.
     */
    create: XOR<OTPRequestCreateInput, OTPRequestUncheckedCreateInput>
    /**
     * In case the OTPRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OTPRequestUpdateInput, OTPRequestUncheckedUpdateInput>
  }

  /**
   * OTPRequest delete
   */
  export type OTPRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
    /**
     * Filter which OTPRequest to delete.
     */
    where: OTPRequestWhereUniqueInput
  }

  /**
   * OTPRequest deleteMany
   */
  export type OTPRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OTPRequests to delete
     */
    where?: OTPRequestWhereInput
  }

  /**
   * OTPRequest without action
   */
  export type OTPRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPRequest
     */
    select?: OTPRequestSelect<ExtArgs> | null
  }


  /**
   * Model Bundle
   */

  export type AggregateBundle = {
    _count: BundleCountAggregateOutputType | null
    _avg: BundleAvgAggregateOutputType | null
    _sum: BundleSumAggregateOutputType | null
    _min: BundleMinAggregateOutputType | null
    _max: BundleMaxAggregateOutputType | null
  }

  export type BundleAvgAggregateOutputType = {
    whatsappPrice: number | null
    printablePrice: number | null
    completePrice: number | null
  }

  export type BundleSumAggregateOutputType = {
    whatsappPrice: number | null
    printablePrice: number | null
    completePrice: number | null
  }

  export type BundleMinAggregateOutputType = {
    id: string | null
    name: string | null
    whatsappPrice: number | null
    printablePrice: number | null
    completePrice: number | null
    isPopular: boolean | null
    theme: string | null
    description: string | null
    isActive: boolean | null
    themeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    previewImages: string | null
    thumbnailUrl: string | null
    itemImages: string | null
  }

  export type BundleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    whatsappPrice: number | null
    printablePrice: number | null
    completePrice: number | null
    isPopular: boolean | null
    theme: string | null
    description: string | null
    isActive: boolean | null
    themeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    previewImages: string | null
    thumbnailUrl: string | null
    itemImages: string | null
  }

  export type BundleCountAggregateOutputType = {
    id: number
    name: number
    whatsappPrice: number
    printablePrice: number
    completePrice: number
    isPopular: number
    theme: number
    description: number
    isActive: number
    themeId: number
    createdAt: number
    updatedAt: number
    previewImages: number
    thumbnailUrl: number
    itemImages: number
    _all: number
  }


  export type BundleAvgAggregateInputType = {
    whatsappPrice?: true
    printablePrice?: true
    completePrice?: true
  }

  export type BundleSumAggregateInputType = {
    whatsappPrice?: true
    printablePrice?: true
    completePrice?: true
  }

  export type BundleMinAggregateInputType = {
    id?: true
    name?: true
    whatsappPrice?: true
    printablePrice?: true
    completePrice?: true
    isPopular?: true
    theme?: true
    description?: true
    isActive?: true
    themeId?: true
    createdAt?: true
    updatedAt?: true
    previewImages?: true
    thumbnailUrl?: true
    itemImages?: true
  }

  export type BundleMaxAggregateInputType = {
    id?: true
    name?: true
    whatsappPrice?: true
    printablePrice?: true
    completePrice?: true
    isPopular?: true
    theme?: true
    description?: true
    isActive?: true
    themeId?: true
    createdAt?: true
    updatedAt?: true
    previewImages?: true
    thumbnailUrl?: true
    itemImages?: true
  }

  export type BundleCountAggregateInputType = {
    id?: true
    name?: true
    whatsappPrice?: true
    printablePrice?: true
    completePrice?: true
    isPopular?: true
    theme?: true
    description?: true
    isActive?: true
    themeId?: true
    createdAt?: true
    updatedAt?: true
    previewImages?: true
    thumbnailUrl?: true
    itemImages?: true
    _all?: true
  }

  export type BundleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bundle to aggregate.
     */
    where?: BundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bundles to fetch.
     */
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bundles
    **/
    _count?: true | BundleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BundleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BundleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BundleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BundleMaxAggregateInputType
  }

  export type GetBundleAggregateType<T extends BundleAggregateArgs> = {
        [P in keyof T & keyof AggregateBundle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBundle[P]>
      : GetScalarType<T[P], AggregateBundle[P]>
  }




  export type BundleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundleWhereInput
    orderBy?: BundleOrderByWithAggregationInput | BundleOrderByWithAggregationInput[]
    by: BundleScalarFieldEnum[] | BundleScalarFieldEnum
    having?: BundleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BundleCountAggregateInputType | true
    _avg?: BundleAvgAggregateInputType
    _sum?: BundleSumAggregateInputType
    _min?: BundleMinAggregateInputType
    _max?: BundleMaxAggregateInputType
  }

  export type BundleGroupByOutputType = {
    id: string
    name: string
    whatsappPrice: number
    printablePrice: number
    completePrice: number
    isPopular: boolean
    theme: string
    description: string | null
    isActive: boolean
    themeId: string | null
    createdAt: Date
    updatedAt: Date
    previewImages: string | null
    thumbnailUrl: string | null
    itemImages: string | null
    _count: BundleCountAggregateOutputType | null
    _avg: BundleAvgAggregateOutputType | null
    _sum: BundleSumAggregateOutputType | null
    _min: BundleMinAggregateOutputType | null
    _max: BundleMaxAggregateOutputType | null
  }

  type GetBundleGroupByPayload<T extends BundleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BundleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BundleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BundleGroupByOutputType[P]>
            : GetScalarType<T[P], BundleGroupByOutputType[P]>
        }
      >
    >


  export type BundleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    whatsappPrice?: boolean
    printablePrice?: boolean
    completePrice?: boolean
    isPopular?: boolean
    theme?: boolean
    description?: boolean
    isActive?: boolean
    themeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    previewImages?: boolean
    thumbnailUrl?: boolean
    itemImages?: boolean
    themeRef?: boolean | Bundle$themeRefArgs<ExtArgs>
    orders?: boolean | Bundle$ordersArgs<ExtArgs>
    bundleItems?: boolean | Bundle$bundleItemsArgs<ExtArgs>
    _count?: boolean | BundleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundle"]>

  export type BundleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    whatsappPrice?: boolean
    printablePrice?: boolean
    completePrice?: boolean
    isPopular?: boolean
    theme?: boolean
    description?: boolean
    isActive?: boolean
    themeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    previewImages?: boolean
    thumbnailUrl?: boolean
    itemImages?: boolean
    themeRef?: boolean | Bundle$themeRefArgs<ExtArgs>
  }, ExtArgs["result"]["bundle"]>

  export type BundleSelectScalar = {
    id?: boolean
    name?: boolean
    whatsappPrice?: boolean
    printablePrice?: boolean
    completePrice?: boolean
    isPopular?: boolean
    theme?: boolean
    description?: boolean
    isActive?: boolean
    themeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    previewImages?: boolean
    thumbnailUrl?: boolean
    itemImages?: boolean
  }

  export type BundleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    themeRef?: boolean | Bundle$themeRefArgs<ExtArgs>
    orders?: boolean | Bundle$ordersArgs<ExtArgs>
    bundleItems?: boolean | Bundle$bundleItemsArgs<ExtArgs>
    _count?: boolean | BundleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BundleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    themeRef?: boolean | Bundle$themeRefArgs<ExtArgs>
  }

  export type $BundlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bundle"
    objects: {
      themeRef: Prisma.$ThemePayload<ExtArgs> | null
      orders: Prisma.$OrderPayload<ExtArgs>[]
      bundleItems: Prisma.$BundleItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      whatsappPrice: number
      printablePrice: number
      completePrice: number
      isPopular: boolean
      theme: string
      description: string | null
      isActive: boolean
      themeId: string | null
      createdAt: Date
      updatedAt: Date
      previewImages: string | null
      thumbnailUrl: string | null
      itemImages: string | null
    }, ExtArgs["result"]["bundle"]>
    composites: {}
  }

  type BundleGetPayload<S extends boolean | null | undefined | BundleDefaultArgs> = $Result.GetResult<Prisma.$BundlePayload, S>

  type BundleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BundleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BundleCountAggregateInputType | true
    }

  export interface BundleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bundle'], meta: { name: 'Bundle' } }
    /**
     * Find zero or one Bundle that matches the filter.
     * @param {BundleFindUniqueArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BundleFindUniqueArgs>(args: SelectSubset<T, BundleFindUniqueArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Bundle that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BundleFindUniqueOrThrowArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BundleFindUniqueOrThrowArgs>(args: SelectSubset<T, BundleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Bundle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleFindFirstArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BundleFindFirstArgs>(args?: SelectSubset<T, BundleFindFirstArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Bundle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleFindFirstOrThrowArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BundleFindFirstOrThrowArgs>(args?: SelectSubset<T, BundleFindFirstOrThrowArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Bundles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bundles
     * const bundles = await prisma.bundle.findMany()
     * 
     * // Get first 10 Bundles
     * const bundles = await prisma.bundle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bundleWithIdOnly = await prisma.bundle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BundleFindManyArgs>(args?: SelectSubset<T, BundleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Bundle.
     * @param {BundleCreateArgs} args - Arguments to create a Bundle.
     * @example
     * // Create one Bundle
     * const Bundle = await prisma.bundle.create({
     *   data: {
     *     // ... data to create a Bundle
     *   }
     * })
     * 
     */
    create<T extends BundleCreateArgs>(args: SelectSubset<T, BundleCreateArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Bundles.
     * @param {BundleCreateManyArgs} args - Arguments to create many Bundles.
     * @example
     * // Create many Bundles
     * const bundle = await prisma.bundle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BundleCreateManyArgs>(args?: SelectSubset<T, BundleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bundles and returns the data saved in the database.
     * @param {BundleCreateManyAndReturnArgs} args - Arguments to create many Bundles.
     * @example
     * // Create many Bundles
     * const bundle = await prisma.bundle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bundles and only return the `id`
     * const bundleWithIdOnly = await prisma.bundle.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BundleCreateManyAndReturnArgs>(args?: SelectSubset<T, BundleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Bundle.
     * @param {BundleDeleteArgs} args - Arguments to delete one Bundle.
     * @example
     * // Delete one Bundle
     * const Bundle = await prisma.bundle.delete({
     *   where: {
     *     // ... filter to delete one Bundle
     *   }
     * })
     * 
     */
    delete<T extends BundleDeleteArgs>(args: SelectSubset<T, BundleDeleteArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Bundle.
     * @param {BundleUpdateArgs} args - Arguments to update one Bundle.
     * @example
     * // Update one Bundle
     * const bundle = await prisma.bundle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BundleUpdateArgs>(args: SelectSubset<T, BundleUpdateArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Bundles.
     * @param {BundleDeleteManyArgs} args - Arguments to filter Bundles to delete.
     * @example
     * // Delete a few Bundles
     * const { count } = await prisma.bundle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BundleDeleteManyArgs>(args?: SelectSubset<T, BundleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bundles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bundles
     * const bundle = await prisma.bundle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BundleUpdateManyArgs>(args: SelectSubset<T, BundleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bundle.
     * @param {BundleUpsertArgs} args - Arguments to update or create a Bundle.
     * @example
     * // Update or create a Bundle
     * const bundle = await prisma.bundle.upsert({
     *   create: {
     *     // ... data to create a Bundle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bundle we want to update
     *   }
     * })
     */
    upsert<T extends BundleUpsertArgs>(args: SelectSubset<T, BundleUpsertArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Bundles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleCountArgs} args - Arguments to filter Bundles to count.
     * @example
     * // Count the number of Bundles
     * const count = await prisma.bundle.count({
     *   where: {
     *     // ... the filter for the Bundles we want to count
     *   }
     * })
    **/
    count<T extends BundleCountArgs>(
      args?: Subset<T, BundleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BundleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bundle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BundleAggregateArgs>(args: Subset<T, BundleAggregateArgs>): Prisma.PrismaPromise<GetBundleAggregateType<T>>

    /**
     * Group by Bundle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BundleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BundleGroupByArgs['orderBy'] }
        : { orderBy?: BundleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BundleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBundleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bundle model
   */
  readonly fields: BundleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bundle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BundleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    themeRef<T extends Bundle$themeRefArgs<ExtArgs> = {}>(args?: Subset<T, Bundle$themeRefArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    orders<T extends Bundle$ordersArgs<ExtArgs> = {}>(args?: Subset<T, Bundle$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany"> | Null>
    bundleItems<T extends Bundle$bundleItemsArgs<ExtArgs> = {}>(args?: Subset<T, Bundle$bundleItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bundle model
   */ 
  interface BundleFieldRefs {
    readonly id: FieldRef<"Bundle", 'String'>
    readonly name: FieldRef<"Bundle", 'String'>
    readonly whatsappPrice: FieldRef<"Bundle", 'Int'>
    readonly printablePrice: FieldRef<"Bundle", 'Int'>
    readonly completePrice: FieldRef<"Bundle", 'Int'>
    readonly isPopular: FieldRef<"Bundle", 'Boolean'>
    readonly theme: FieldRef<"Bundle", 'String'>
    readonly description: FieldRef<"Bundle", 'String'>
    readonly isActive: FieldRef<"Bundle", 'Boolean'>
    readonly themeId: FieldRef<"Bundle", 'String'>
    readonly createdAt: FieldRef<"Bundle", 'DateTime'>
    readonly updatedAt: FieldRef<"Bundle", 'DateTime'>
    readonly previewImages: FieldRef<"Bundle", 'String'>
    readonly thumbnailUrl: FieldRef<"Bundle", 'String'>
    readonly itemImages: FieldRef<"Bundle", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Bundle findUnique
   */
  export type BundleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundle to fetch.
     */
    where: BundleWhereUniqueInput
  }

  /**
   * Bundle findUniqueOrThrow
   */
  export type BundleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundle to fetch.
     */
    where: BundleWhereUniqueInput
  }

  /**
   * Bundle findFirst
   */
  export type BundleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundle to fetch.
     */
    where?: BundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bundles to fetch.
     */
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bundles.
     */
    cursor?: BundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bundles.
     */
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * Bundle findFirstOrThrow
   */
  export type BundleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundle to fetch.
     */
    where?: BundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bundles to fetch.
     */
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bundles.
     */
    cursor?: BundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bundles.
     */
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * Bundle findMany
   */
  export type BundleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundles to fetch.
     */
    where?: BundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bundles to fetch.
     */
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bundles.
     */
    cursor?: BundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bundles.
     */
    skip?: number
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * Bundle create
   */
  export type BundleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * The data needed to create a Bundle.
     */
    data: XOR<BundleCreateInput, BundleUncheckedCreateInput>
  }

  /**
   * Bundle createMany
   */
  export type BundleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bundles.
     */
    data: BundleCreateManyInput | BundleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bundle createManyAndReturn
   */
  export type BundleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Bundles.
     */
    data: BundleCreateManyInput | BundleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bundle update
   */
  export type BundleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * The data needed to update a Bundle.
     */
    data: XOR<BundleUpdateInput, BundleUncheckedUpdateInput>
    /**
     * Choose, which Bundle to update.
     */
    where: BundleWhereUniqueInput
  }

  /**
   * Bundle updateMany
   */
  export type BundleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bundles.
     */
    data: XOR<BundleUpdateManyMutationInput, BundleUncheckedUpdateManyInput>
    /**
     * Filter which Bundles to update
     */
    where?: BundleWhereInput
  }

  /**
   * Bundle upsert
   */
  export type BundleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * The filter to search for the Bundle to update in case it exists.
     */
    where: BundleWhereUniqueInput
    /**
     * In case the Bundle found by the `where` argument doesn't exist, create a new Bundle with this data.
     */
    create: XOR<BundleCreateInput, BundleUncheckedCreateInput>
    /**
     * In case the Bundle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BundleUpdateInput, BundleUncheckedUpdateInput>
  }

  /**
   * Bundle delete
   */
  export type BundleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter which Bundle to delete.
     */
    where: BundleWhereUniqueInput
  }

  /**
   * Bundle deleteMany
   */
  export type BundleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bundles to delete
     */
    where?: BundleWhereInput
  }

  /**
   * Bundle.themeRef
   */
  export type Bundle$themeRefArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    where?: ThemeWhereInput
  }

  /**
   * Bundle.orders
   */
  export type Bundle$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Bundle.bundleItems
   */
  export type Bundle$bundleItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    where?: BundleItemWhereInput
    orderBy?: BundleItemOrderByWithRelationInput | BundleItemOrderByWithRelationInput[]
    cursor?: BundleItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BundleItemScalarFieldEnum | BundleItemScalarFieldEnum[]
  }

  /**
   * Bundle without action
   */
  export type BundleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
  }


  /**
   * Model BundleItem
   */

  export type AggregateBundleItem = {
    _count: BundleItemCountAggregateOutputType | null
    _min: BundleItemMinAggregateOutputType | null
    _max: BundleItemMaxAggregateOutputType | null
  }

  export type BundleItemMinAggregateOutputType = {
    id: string | null
    bundleId: string | null
    eventType: string | null
    templateName: string | null
    templateFile: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BundleItemMaxAggregateOutputType = {
    id: string | null
    bundleId: string | null
    eventType: string | null
    templateName: string | null
    templateFile: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BundleItemCountAggregateOutputType = {
    id: number
    bundleId: number
    eventType: number
    templateName: number
    templateFile: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BundleItemMinAggregateInputType = {
    id?: true
    bundleId?: true
    eventType?: true
    templateName?: true
    templateFile?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BundleItemMaxAggregateInputType = {
    id?: true
    bundleId?: true
    eventType?: true
    templateName?: true
    templateFile?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BundleItemCountAggregateInputType = {
    id?: true
    bundleId?: true
    eventType?: true
    templateName?: true
    templateFile?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BundleItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BundleItem to aggregate.
     */
    where?: BundleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BundleItems to fetch.
     */
    orderBy?: BundleItemOrderByWithRelationInput | BundleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BundleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BundleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BundleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BundleItems
    **/
    _count?: true | BundleItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BundleItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BundleItemMaxAggregateInputType
  }

  export type GetBundleItemAggregateType<T extends BundleItemAggregateArgs> = {
        [P in keyof T & keyof AggregateBundleItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBundleItem[P]>
      : GetScalarType<T[P], AggregateBundleItem[P]>
  }




  export type BundleItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundleItemWhereInput
    orderBy?: BundleItemOrderByWithAggregationInput | BundleItemOrderByWithAggregationInput[]
    by: BundleItemScalarFieldEnum[] | BundleItemScalarFieldEnum
    having?: BundleItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BundleItemCountAggregateInputType | true
    _min?: BundleItemMinAggregateInputType
    _max?: BundleItemMaxAggregateInputType
  }

  export type BundleItemGroupByOutputType = {
    id: string
    bundleId: string
    eventType: string
    templateName: string
    templateFile: string
    createdAt: Date
    updatedAt: Date
    _count: BundleItemCountAggregateOutputType | null
    _min: BundleItemMinAggregateOutputType | null
    _max: BundleItemMaxAggregateOutputType | null
  }

  type GetBundleItemGroupByPayload<T extends BundleItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BundleItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BundleItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BundleItemGroupByOutputType[P]>
            : GetScalarType<T[P], BundleItemGroupByOutputType[P]>
        }
      >
    >


  export type BundleItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bundleId?: boolean
    eventType?: boolean
    templateName?: boolean
    templateFile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundleItem"]>

  export type BundleItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bundleId?: boolean
    eventType?: boolean
    templateName?: boolean
    templateFile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundleItem"]>

  export type BundleItemSelectScalar = {
    id?: boolean
    bundleId?: boolean
    eventType?: boolean
    templateName?: boolean
    templateFile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BundleItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
  }
  export type BundleItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
  }

  export type $BundleItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BundleItem"
    objects: {
      bundle: Prisma.$BundlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bundleId: string
      eventType: string
      templateName: string
      templateFile: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bundleItem"]>
    composites: {}
  }

  type BundleItemGetPayload<S extends boolean | null | undefined | BundleItemDefaultArgs> = $Result.GetResult<Prisma.$BundleItemPayload, S>

  type BundleItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BundleItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BundleItemCountAggregateInputType | true
    }

  export interface BundleItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BundleItem'], meta: { name: 'BundleItem' } }
    /**
     * Find zero or one BundleItem that matches the filter.
     * @param {BundleItemFindUniqueArgs} args - Arguments to find a BundleItem
     * @example
     * // Get one BundleItem
     * const bundleItem = await prisma.bundleItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BundleItemFindUniqueArgs>(args: SelectSubset<T, BundleItemFindUniqueArgs<ExtArgs>>): Prisma__BundleItemClient<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BundleItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BundleItemFindUniqueOrThrowArgs} args - Arguments to find a BundleItem
     * @example
     * // Get one BundleItem
     * const bundleItem = await prisma.bundleItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BundleItemFindUniqueOrThrowArgs>(args: SelectSubset<T, BundleItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BundleItemClient<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BundleItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleItemFindFirstArgs} args - Arguments to find a BundleItem
     * @example
     * // Get one BundleItem
     * const bundleItem = await prisma.bundleItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BundleItemFindFirstArgs>(args?: SelectSubset<T, BundleItemFindFirstArgs<ExtArgs>>): Prisma__BundleItemClient<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BundleItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleItemFindFirstOrThrowArgs} args - Arguments to find a BundleItem
     * @example
     * // Get one BundleItem
     * const bundleItem = await prisma.bundleItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BundleItemFindFirstOrThrowArgs>(args?: SelectSubset<T, BundleItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__BundleItemClient<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BundleItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BundleItems
     * const bundleItems = await prisma.bundleItem.findMany()
     * 
     * // Get first 10 BundleItems
     * const bundleItems = await prisma.bundleItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bundleItemWithIdOnly = await prisma.bundleItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BundleItemFindManyArgs>(args?: SelectSubset<T, BundleItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BundleItem.
     * @param {BundleItemCreateArgs} args - Arguments to create a BundleItem.
     * @example
     * // Create one BundleItem
     * const BundleItem = await prisma.bundleItem.create({
     *   data: {
     *     // ... data to create a BundleItem
     *   }
     * })
     * 
     */
    create<T extends BundleItemCreateArgs>(args: SelectSubset<T, BundleItemCreateArgs<ExtArgs>>): Prisma__BundleItemClient<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BundleItems.
     * @param {BundleItemCreateManyArgs} args - Arguments to create many BundleItems.
     * @example
     * // Create many BundleItems
     * const bundleItem = await prisma.bundleItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BundleItemCreateManyArgs>(args?: SelectSubset<T, BundleItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BundleItems and returns the data saved in the database.
     * @param {BundleItemCreateManyAndReturnArgs} args - Arguments to create many BundleItems.
     * @example
     * // Create many BundleItems
     * const bundleItem = await prisma.bundleItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BundleItems and only return the `id`
     * const bundleItemWithIdOnly = await prisma.bundleItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BundleItemCreateManyAndReturnArgs>(args?: SelectSubset<T, BundleItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BundleItem.
     * @param {BundleItemDeleteArgs} args - Arguments to delete one BundleItem.
     * @example
     * // Delete one BundleItem
     * const BundleItem = await prisma.bundleItem.delete({
     *   where: {
     *     // ... filter to delete one BundleItem
     *   }
     * })
     * 
     */
    delete<T extends BundleItemDeleteArgs>(args: SelectSubset<T, BundleItemDeleteArgs<ExtArgs>>): Prisma__BundleItemClient<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BundleItem.
     * @param {BundleItemUpdateArgs} args - Arguments to update one BundleItem.
     * @example
     * // Update one BundleItem
     * const bundleItem = await prisma.bundleItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BundleItemUpdateArgs>(args: SelectSubset<T, BundleItemUpdateArgs<ExtArgs>>): Prisma__BundleItemClient<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BundleItems.
     * @param {BundleItemDeleteManyArgs} args - Arguments to filter BundleItems to delete.
     * @example
     * // Delete a few BundleItems
     * const { count } = await prisma.bundleItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BundleItemDeleteManyArgs>(args?: SelectSubset<T, BundleItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BundleItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BundleItems
     * const bundleItem = await prisma.bundleItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BundleItemUpdateManyArgs>(args: SelectSubset<T, BundleItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BundleItem.
     * @param {BundleItemUpsertArgs} args - Arguments to update or create a BundleItem.
     * @example
     * // Update or create a BundleItem
     * const bundleItem = await prisma.bundleItem.upsert({
     *   create: {
     *     // ... data to create a BundleItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BundleItem we want to update
     *   }
     * })
     */
    upsert<T extends BundleItemUpsertArgs>(args: SelectSubset<T, BundleItemUpsertArgs<ExtArgs>>): Prisma__BundleItemClient<$Result.GetResult<Prisma.$BundleItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BundleItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleItemCountArgs} args - Arguments to filter BundleItems to count.
     * @example
     * // Count the number of BundleItems
     * const count = await prisma.bundleItem.count({
     *   where: {
     *     // ... the filter for the BundleItems we want to count
     *   }
     * })
    **/
    count<T extends BundleItemCountArgs>(
      args?: Subset<T, BundleItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BundleItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BundleItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BundleItemAggregateArgs>(args: Subset<T, BundleItemAggregateArgs>): Prisma.PrismaPromise<GetBundleItemAggregateType<T>>

    /**
     * Group by BundleItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BundleItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BundleItemGroupByArgs['orderBy'] }
        : { orderBy?: BundleItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BundleItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBundleItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BundleItem model
   */
  readonly fields: BundleItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BundleItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BundleItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bundle<T extends BundleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BundleDefaultArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BundleItem model
   */ 
  interface BundleItemFieldRefs {
    readonly id: FieldRef<"BundleItem", 'String'>
    readonly bundleId: FieldRef<"BundleItem", 'String'>
    readonly eventType: FieldRef<"BundleItem", 'String'>
    readonly templateName: FieldRef<"BundleItem", 'String'>
    readonly templateFile: FieldRef<"BundleItem", 'String'>
    readonly createdAt: FieldRef<"BundleItem", 'DateTime'>
    readonly updatedAt: FieldRef<"BundleItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BundleItem findUnique
   */
  export type BundleItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * Filter, which BundleItem to fetch.
     */
    where: BundleItemWhereUniqueInput
  }

  /**
   * BundleItem findUniqueOrThrow
   */
  export type BundleItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * Filter, which BundleItem to fetch.
     */
    where: BundleItemWhereUniqueInput
  }

  /**
   * BundleItem findFirst
   */
  export type BundleItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * Filter, which BundleItem to fetch.
     */
    where?: BundleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BundleItems to fetch.
     */
    orderBy?: BundleItemOrderByWithRelationInput | BundleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BundleItems.
     */
    cursor?: BundleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BundleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BundleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BundleItems.
     */
    distinct?: BundleItemScalarFieldEnum | BundleItemScalarFieldEnum[]
  }

  /**
   * BundleItem findFirstOrThrow
   */
  export type BundleItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * Filter, which BundleItem to fetch.
     */
    where?: BundleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BundleItems to fetch.
     */
    orderBy?: BundleItemOrderByWithRelationInput | BundleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BundleItems.
     */
    cursor?: BundleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BundleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BundleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BundleItems.
     */
    distinct?: BundleItemScalarFieldEnum | BundleItemScalarFieldEnum[]
  }

  /**
   * BundleItem findMany
   */
  export type BundleItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * Filter, which BundleItems to fetch.
     */
    where?: BundleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BundleItems to fetch.
     */
    orderBy?: BundleItemOrderByWithRelationInput | BundleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BundleItems.
     */
    cursor?: BundleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BundleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BundleItems.
     */
    skip?: number
    distinct?: BundleItemScalarFieldEnum | BundleItemScalarFieldEnum[]
  }

  /**
   * BundleItem create
   */
  export type BundleItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * The data needed to create a BundleItem.
     */
    data: XOR<BundleItemCreateInput, BundleItemUncheckedCreateInput>
  }

  /**
   * BundleItem createMany
   */
  export type BundleItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BundleItems.
     */
    data: BundleItemCreateManyInput | BundleItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BundleItem createManyAndReturn
   */
  export type BundleItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BundleItems.
     */
    data: BundleItemCreateManyInput | BundleItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BundleItem update
   */
  export type BundleItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * The data needed to update a BundleItem.
     */
    data: XOR<BundleItemUpdateInput, BundleItemUncheckedUpdateInput>
    /**
     * Choose, which BundleItem to update.
     */
    where: BundleItemWhereUniqueInput
  }

  /**
   * BundleItem updateMany
   */
  export type BundleItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BundleItems.
     */
    data: XOR<BundleItemUpdateManyMutationInput, BundleItemUncheckedUpdateManyInput>
    /**
     * Filter which BundleItems to update
     */
    where?: BundleItemWhereInput
  }

  /**
   * BundleItem upsert
   */
  export type BundleItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * The filter to search for the BundleItem to update in case it exists.
     */
    where: BundleItemWhereUniqueInput
    /**
     * In case the BundleItem found by the `where` argument doesn't exist, create a new BundleItem with this data.
     */
    create: XOR<BundleItemCreateInput, BundleItemUncheckedCreateInput>
    /**
     * In case the BundleItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BundleItemUpdateInput, BundleItemUncheckedUpdateInput>
  }

  /**
   * BundleItem delete
   */
  export type BundleItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
    /**
     * Filter which BundleItem to delete.
     */
    where: BundleItemWhereUniqueInput
  }

  /**
   * BundleItem deleteMany
   */
  export type BundleItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BundleItems to delete
     */
    where?: BundleItemWhereInput
  }

  /**
   * BundleItem without action
   */
  export type BundleItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleItem
     */
    select?: BundleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleItemInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    totalAmount: number | null
  }

  export type OrderSumAggregateOutputType = {
    totalAmount: number | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    bundleId: string | null
    totalAmount: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    bundleId: string | null
    totalAmount: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    userId: number
    bundleId: number
    totalAmount: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    totalAmount?: true
  }

  export type OrderSumAggregateInputType = {
    totalAmount?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    userId?: true
    bundleId?: true
    totalAmount?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    userId?: true
    bundleId?: true
    totalAmount?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    userId?: true
    bundleId?: true
    totalAmount?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    userId: string
    bundleId: string
    totalAmount: number
    status: string
    createdAt: Date
    updatedAt: Date
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    bundleId?: boolean
    totalAmount?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    bundleId?: boolean
    totalAmount?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    userId?: boolean
    bundleId?: boolean
    totalAmount?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      bundle: Prisma.$BundlePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      bundleId: string
      totalAmount: number
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bundle<T extends BundleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BundleDefaultArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */ 
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly userId: FieldRef<"Order", 'String'>
    readonly bundleId: FieldRef<"Order", 'String'>
    readonly totalAmount: FieldRef<"Order", 'Float'>
    readonly status: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly updatedAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model Theme
   */

  export type AggregateTheme = {
    _count: ThemeCountAggregateOutputType | null
    _min: ThemeMinAggregateOutputType | null
    _max: ThemeMaxAggregateOutputType | null
  }

  export type ThemeMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    thumbnailUrl: string | null
    previewImages: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    isBestSeller: boolean | null
    isPopular: boolean | null
  }

  export type ThemeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    thumbnailUrl: string | null
    previewImages: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    isBestSeller: boolean | null
    isPopular: boolean | null
  }

  export type ThemeCountAggregateOutputType = {
    id: number
    name: number
    description: number
    thumbnailUrl: number
    previewImages: number
    isActive: number
    createdAt: number
    updatedAt: number
    isBestSeller: number
    isPopular: number
    _all: number
  }


  export type ThemeMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    thumbnailUrl?: true
    previewImages?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    isBestSeller?: true
    isPopular?: true
  }

  export type ThemeMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    thumbnailUrl?: true
    previewImages?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    isBestSeller?: true
    isPopular?: true
  }

  export type ThemeCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    thumbnailUrl?: true
    previewImages?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    isBestSeller?: true
    isPopular?: true
    _all?: true
  }

  export type ThemeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Theme to aggregate.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Themes
    **/
    _count?: true | ThemeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ThemeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ThemeMaxAggregateInputType
  }

  export type GetThemeAggregateType<T extends ThemeAggregateArgs> = {
        [P in keyof T & keyof AggregateTheme]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTheme[P]>
      : GetScalarType<T[P], AggregateTheme[P]>
  }




  export type ThemeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThemeWhereInput
    orderBy?: ThemeOrderByWithAggregationInput | ThemeOrderByWithAggregationInput[]
    by: ThemeScalarFieldEnum[] | ThemeScalarFieldEnum
    having?: ThemeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ThemeCountAggregateInputType | true
    _min?: ThemeMinAggregateInputType
    _max?: ThemeMaxAggregateInputType
  }

  export type ThemeGroupByOutputType = {
    id: string
    name: string
    description: string | null
    thumbnailUrl: string | null
    previewImages: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    isBestSeller: boolean
    isPopular: boolean
    _count: ThemeCountAggregateOutputType | null
    _min: ThemeMinAggregateOutputType | null
    _max: ThemeMaxAggregateOutputType | null
  }

  type GetThemeGroupByPayload<T extends ThemeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ThemeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ThemeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ThemeGroupByOutputType[P]>
            : GetScalarType<T[P], ThemeGroupByOutputType[P]>
        }
      >
    >


  export type ThemeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    thumbnailUrl?: boolean
    previewImages?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isBestSeller?: boolean
    isPopular?: boolean
    bundles?: boolean | Theme$bundlesArgs<ExtArgs>
    weddings?: boolean | Theme$weddingsArgs<ExtArgs>
    _count?: boolean | ThemeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["theme"]>

  export type ThemeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    thumbnailUrl?: boolean
    previewImages?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isBestSeller?: boolean
    isPopular?: boolean
  }, ExtArgs["result"]["theme"]>

  export type ThemeSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    thumbnailUrl?: boolean
    previewImages?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isBestSeller?: boolean
    isPopular?: boolean
  }

  export type ThemeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundles?: boolean | Theme$bundlesArgs<ExtArgs>
    weddings?: boolean | Theme$weddingsArgs<ExtArgs>
    _count?: boolean | ThemeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ThemeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ThemePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Theme"
    objects: {
      bundles: Prisma.$BundlePayload<ExtArgs>[]
      weddings: Prisma.$WeddingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      thumbnailUrl: string | null
      previewImages: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      isBestSeller: boolean
      isPopular: boolean
    }, ExtArgs["result"]["theme"]>
    composites: {}
  }

  type ThemeGetPayload<S extends boolean | null | undefined | ThemeDefaultArgs> = $Result.GetResult<Prisma.$ThemePayload, S>

  type ThemeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ThemeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ThemeCountAggregateInputType | true
    }

  export interface ThemeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Theme'], meta: { name: 'Theme' } }
    /**
     * Find zero or one Theme that matches the filter.
     * @param {ThemeFindUniqueArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ThemeFindUniqueArgs>(args: SelectSubset<T, ThemeFindUniqueArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Theme that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ThemeFindUniqueOrThrowArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ThemeFindUniqueOrThrowArgs>(args: SelectSubset<T, ThemeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Theme that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindFirstArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ThemeFindFirstArgs>(args?: SelectSubset<T, ThemeFindFirstArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Theme that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindFirstOrThrowArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ThemeFindFirstOrThrowArgs>(args?: SelectSubset<T, ThemeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Themes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Themes
     * const themes = await prisma.theme.findMany()
     * 
     * // Get first 10 Themes
     * const themes = await prisma.theme.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const themeWithIdOnly = await prisma.theme.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ThemeFindManyArgs>(args?: SelectSubset<T, ThemeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Theme.
     * @param {ThemeCreateArgs} args - Arguments to create a Theme.
     * @example
     * // Create one Theme
     * const Theme = await prisma.theme.create({
     *   data: {
     *     // ... data to create a Theme
     *   }
     * })
     * 
     */
    create<T extends ThemeCreateArgs>(args: SelectSubset<T, ThemeCreateArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Themes.
     * @param {ThemeCreateManyArgs} args - Arguments to create many Themes.
     * @example
     * // Create many Themes
     * const theme = await prisma.theme.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ThemeCreateManyArgs>(args?: SelectSubset<T, ThemeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Themes and returns the data saved in the database.
     * @param {ThemeCreateManyAndReturnArgs} args - Arguments to create many Themes.
     * @example
     * // Create many Themes
     * const theme = await prisma.theme.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Themes and only return the `id`
     * const themeWithIdOnly = await prisma.theme.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ThemeCreateManyAndReturnArgs>(args?: SelectSubset<T, ThemeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Theme.
     * @param {ThemeDeleteArgs} args - Arguments to delete one Theme.
     * @example
     * // Delete one Theme
     * const Theme = await prisma.theme.delete({
     *   where: {
     *     // ... filter to delete one Theme
     *   }
     * })
     * 
     */
    delete<T extends ThemeDeleteArgs>(args: SelectSubset<T, ThemeDeleteArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Theme.
     * @param {ThemeUpdateArgs} args - Arguments to update one Theme.
     * @example
     * // Update one Theme
     * const theme = await prisma.theme.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ThemeUpdateArgs>(args: SelectSubset<T, ThemeUpdateArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Themes.
     * @param {ThemeDeleteManyArgs} args - Arguments to filter Themes to delete.
     * @example
     * // Delete a few Themes
     * const { count } = await prisma.theme.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ThemeDeleteManyArgs>(args?: SelectSubset<T, ThemeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Themes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Themes
     * const theme = await prisma.theme.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ThemeUpdateManyArgs>(args: SelectSubset<T, ThemeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Theme.
     * @param {ThemeUpsertArgs} args - Arguments to update or create a Theme.
     * @example
     * // Update or create a Theme
     * const theme = await prisma.theme.upsert({
     *   create: {
     *     // ... data to create a Theme
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Theme we want to update
     *   }
     * })
     */
    upsert<T extends ThemeUpsertArgs>(args: SelectSubset<T, ThemeUpsertArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Themes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeCountArgs} args - Arguments to filter Themes to count.
     * @example
     * // Count the number of Themes
     * const count = await prisma.theme.count({
     *   where: {
     *     // ... the filter for the Themes we want to count
     *   }
     * })
    **/
    count<T extends ThemeCountArgs>(
      args?: Subset<T, ThemeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThemeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Theme.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThemeAggregateArgs>(args: Subset<T, ThemeAggregateArgs>): Prisma.PrismaPromise<GetThemeAggregateType<T>>

    /**
     * Group by Theme.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ThemeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ThemeGroupByArgs['orderBy'] }
        : { orderBy?: ThemeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ThemeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThemeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Theme model
   */
  readonly fields: ThemeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Theme.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ThemeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bundles<T extends Theme$bundlesArgs<ExtArgs> = {}>(args?: Subset<T, Theme$bundlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findMany"> | Null>
    weddings<T extends Theme$weddingsArgs<ExtArgs> = {}>(args?: Subset<T, Theme$weddingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Theme model
   */ 
  interface ThemeFieldRefs {
    readonly id: FieldRef<"Theme", 'String'>
    readonly name: FieldRef<"Theme", 'String'>
    readonly description: FieldRef<"Theme", 'String'>
    readonly thumbnailUrl: FieldRef<"Theme", 'String'>
    readonly previewImages: FieldRef<"Theme", 'String'>
    readonly isActive: FieldRef<"Theme", 'Boolean'>
    readonly createdAt: FieldRef<"Theme", 'DateTime'>
    readonly updatedAt: FieldRef<"Theme", 'DateTime'>
    readonly isBestSeller: FieldRef<"Theme", 'Boolean'>
    readonly isPopular: FieldRef<"Theme", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Theme findUnique
   */
  export type ThemeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme findUniqueOrThrow
   */
  export type ThemeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme findFirst
   */
  export type ThemeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Themes.
     */
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme findFirstOrThrow
   */
  export type ThemeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Themes.
     */
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme findMany
   */
  export type ThemeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Themes to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme create
   */
  export type ThemeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The data needed to create a Theme.
     */
    data: XOR<ThemeCreateInput, ThemeUncheckedCreateInput>
  }

  /**
   * Theme createMany
   */
  export type ThemeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Themes.
     */
    data: ThemeCreateManyInput | ThemeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Theme createManyAndReturn
   */
  export type ThemeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Themes.
     */
    data: ThemeCreateManyInput | ThemeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Theme update
   */
  export type ThemeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The data needed to update a Theme.
     */
    data: XOR<ThemeUpdateInput, ThemeUncheckedUpdateInput>
    /**
     * Choose, which Theme to update.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme updateMany
   */
  export type ThemeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Themes.
     */
    data: XOR<ThemeUpdateManyMutationInput, ThemeUncheckedUpdateManyInput>
    /**
     * Filter which Themes to update
     */
    where?: ThemeWhereInput
  }

  /**
   * Theme upsert
   */
  export type ThemeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The filter to search for the Theme to update in case it exists.
     */
    where: ThemeWhereUniqueInput
    /**
     * In case the Theme found by the `where` argument doesn't exist, create a new Theme with this data.
     */
    create: XOR<ThemeCreateInput, ThemeUncheckedCreateInput>
    /**
     * In case the Theme was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ThemeUpdateInput, ThemeUncheckedUpdateInput>
  }

  /**
   * Theme delete
   */
  export type ThemeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter which Theme to delete.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme deleteMany
   */
  export type ThemeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Themes to delete
     */
    where?: ThemeWhereInput
  }

  /**
   * Theme.bundles
   */
  export type Theme$bundlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    where?: BundleWhereInput
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    cursor?: BundleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * Theme.weddings
   */
  export type Theme$weddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    where?: WeddingWhereInput
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    cursor?: WeddingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeddingScalarFieldEnum | WeddingScalarFieldEnum[]
  }

  /**
   * Theme without action
   */
  export type ThemeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
  }


  /**
   * Model Wedding
   */

  export type AggregateWedding = {
    _count: WeddingCountAggregateOutputType | null
    _min: WeddingMinAggregateOutputType | null
    _max: WeddingMaxAggregateOutputType | null
  }

  export type WeddingMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    themeId: string | null
    groomName: string | null
    brideName: string | null
    groomParents: string | null
    brideParents: string | null
    rsvpContact: string | null
    rsvpDeadline: Date | null
    invitationMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WeddingMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    themeId: string | null
    groomName: string | null
    brideName: string | null
    groomParents: string | null
    brideParents: string | null
    rsvpContact: string | null
    rsvpDeadline: Date | null
    invitationMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WeddingCountAggregateOutputType = {
    id: number
    ownerId: number
    themeId: number
    groomName: number
    brideName: number
    groomParents: number
    brideParents: number
    rsvpContact: number
    rsvpDeadline: number
    invitationMessage: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WeddingMinAggregateInputType = {
    id?: true
    ownerId?: true
    themeId?: true
    groomName?: true
    brideName?: true
    groomParents?: true
    brideParents?: true
    rsvpContact?: true
    rsvpDeadline?: true
    invitationMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WeddingMaxAggregateInputType = {
    id?: true
    ownerId?: true
    themeId?: true
    groomName?: true
    brideName?: true
    groomParents?: true
    brideParents?: true
    rsvpContact?: true
    rsvpDeadline?: true
    invitationMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WeddingCountAggregateInputType = {
    id?: true
    ownerId?: true
    themeId?: true
    groomName?: true
    brideName?: true
    groomParents?: true
    brideParents?: true
    rsvpContact?: true
    rsvpDeadline?: true
    invitationMessage?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WeddingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wedding to aggregate.
     */
    where?: WeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weddings to fetch.
     */
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Weddings
    **/
    _count?: true | WeddingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeddingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeddingMaxAggregateInputType
  }

  export type GetWeddingAggregateType<T extends WeddingAggregateArgs> = {
        [P in keyof T & keyof AggregateWedding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWedding[P]>
      : GetScalarType<T[P], AggregateWedding[P]>
  }




  export type WeddingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingWhereInput
    orderBy?: WeddingOrderByWithAggregationInput | WeddingOrderByWithAggregationInput[]
    by: WeddingScalarFieldEnum[] | WeddingScalarFieldEnum
    having?: WeddingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeddingCountAggregateInputType | true
    _min?: WeddingMinAggregateInputType
    _max?: WeddingMaxAggregateInputType
  }

  export type WeddingGroupByOutputType = {
    id: string
    ownerId: string
    themeId: string
    groomName: string
    brideName: string
    groomParents: string | null
    brideParents: string | null
    rsvpContact: string | null
    rsvpDeadline: Date | null
    invitationMessage: string | null
    createdAt: Date
    updatedAt: Date
    _count: WeddingCountAggregateOutputType | null
    _min: WeddingMinAggregateOutputType | null
    _max: WeddingMaxAggregateOutputType | null
  }

  type GetWeddingGroupByPayload<T extends WeddingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeddingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeddingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeddingGroupByOutputType[P]>
            : GetScalarType<T[P], WeddingGroupByOutputType[P]>
        }
      >
    >


  export type WeddingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    themeId?: boolean
    groomName?: boolean
    brideName?: boolean
    groomParents?: boolean
    brideParents?: boolean
    rsvpContact?: boolean
    rsvpDeadline?: boolean
    invitationMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    events?: boolean | Wedding$eventsArgs<ExtArgs>
    rsvps?: boolean | Wedding$rsvpsArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    _count?: boolean | WeddingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wedding"]>

  export type WeddingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    themeId?: boolean
    groomName?: boolean
    brideName?: boolean
    groomParents?: boolean
    brideParents?: boolean
    rsvpContact?: boolean
    rsvpDeadline?: boolean
    invitationMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wedding"]>

  export type WeddingSelectScalar = {
    id?: boolean
    ownerId?: boolean
    themeId?: boolean
    groomName?: boolean
    brideName?: boolean
    groomParents?: boolean
    brideParents?: boolean
    rsvpContact?: boolean
    rsvpDeadline?: boolean
    invitationMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WeddingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | Wedding$eventsArgs<ExtArgs>
    rsvps?: boolean | Wedding$rsvpsArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    _count?: boolean | WeddingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WeddingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
  }

  export type $WeddingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wedding"
    objects: {
      events: Prisma.$EventPayload<ExtArgs>[]
      rsvps: Prisma.$RSVPPayload<ExtArgs>[]
      owner: Prisma.$UserPayload<ExtArgs>
      theme: Prisma.$ThemePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      themeId: string
      groomName: string
      brideName: string
      groomParents: string | null
      brideParents: string | null
      rsvpContact: string | null
      rsvpDeadline: Date | null
      invitationMessage: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["wedding"]>
    composites: {}
  }

  type WeddingGetPayload<S extends boolean | null | undefined | WeddingDefaultArgs> = $Result.GetResult<Prisma.$WeddingPayload, S>

  type WeddingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WeddingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WeddingCountAggregateInputType | true
    }

  export interface WeddingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wedding'], meta: { name: 'Wedding' } }
    /**
     * Find zero or one Wedding that matches the filter.
     * @param {WeddingFindUniqueArgs} args - Arguments to find a Wedding
     * @example
     * // Get one Wedding
     * const wedding = await prisma.wedding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeddingFindUniqueArgs>(args: SelectSubset<T, WeddingFindUniqueArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Wedding that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WeddingFindUniqueOrThrowArgs} args - Arguments to find a Wedding
     * @example
     * // Get one Wedding
     * const wedding = await prisma.wedding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeddingFindUniqueOrThrowArgs>(args: SelectSubset<T, WeddingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Wedding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingFindFirstArgs} args - Arguments to find a Wedding
     * @example
     * // Get one Wedding
     * const wedding = await prisma.wedding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeddingFindFirstArgs>(args?: SelectSubset<T, WeddingFindFirstArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Wedding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingFindFirstOrThrowArgs} args - Arguments to find a Wedding
     * @example
     * // Get one Wedding
     * const wedding = await prisma.wedding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeddingFindFirstOrThrowArgs>(args?: SelectSubset<T, WeddingFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Weddings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Weddings
     * const weddings = await prisma.wedding.findMany()
     * 
     * // Get first 10 Weddings
     * const weddings = await prisma.wedding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weddingWithIdOnly = await prisma.wedding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeddingFindManyArgs>(args?: SelectSubset<T, WeddingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Wedding.
     * @param {WeddingCreateArgs} args - Arguments to create a Wedding.
     * @example
     * // Create one Wedding
     * const Wedding = await prisma.wedding.create({
     *   data: {
     *     // ... data to create a Wedding
     *   }
     * })
     * 
     */
    create<T extends WeddingCreateArgs>(args: SelectSubset<T, WeddingCreateArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Weddings.
     * @param {WeddingCreateManyArgs} args - Arguments to create many Weddings.
     * @example
     * // Create many Weddings
     * const wedding = await prisma.wedding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeddingCreateManyArgs>(args?: SelectSubset<T, WeddingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Weddings and returns the data saved in the database.
     * @param {WeddingCreateManyAndReturnArgs} args - Arguments to create many Weddings.
     * @example
     * // Create many Weddings
     * const wedding = await prisma.wedding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Weddings and only return the `id`
     * const weddingWithIdOnly = await prisma.wedding.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeddingCreateManyAndReturnArgs>(args?: SelectSubset<T, WeddingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Wedding.
     * @param {WeddingDeleteArgs} args - Arguments to delete one Wedding.
     * @example
     * // Delete one Wedding
     * const Wedding = await prisma.wedding.delete({
     *   where: {
     *     // ... filter to delete one Wedding
     *   }
     * })
     * 
     */
    delete<T extends WeddingDeleteArgs>(args: SelectSubset<T, WeddingDeleteArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Wedding.
     * @param {WeddingUpdateArgs} args - Arguments to update one Wedding.
     * @example
     * // Update one Wedding
     * const wedding = await prisma.wedding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeddingUpdateArgs>(args: SelectSubset<T, WeddingUpdateArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Weddings.
     * @param {WeddingDeleteManyArgs} args - Arguments to filter Weddings to delete.
     * @example
     * // Delete a few Weddings
     * const { count } = await prisma.wedding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeddingDeleteManyArgs>(args?: SelectSubset<T, WeddingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Weddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Weddings
     * const wedding = await prisma.wedding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeddingUpdateManyArgs>(args: SelectSubset<T, WeddingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Wedding.
     * @param {WeddingUpsertArgs} args - Arguments to update or create a Wedding.
     * @example
     * // Update or create a Wedding
     * const wedding = await prisma.wedding.upsert({
     *   create: {
     *     // ... data to create a Wedding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wedding we want to update
     *   }
     * })
     */
    upsert<T extends WeddingUpsertArgs>(args: SelectSubset<T, WeddingUpsertArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Weddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingCountArgs} args - Arguments to filter Weddings to count.
     * @example
     * // Count the number of Weddings
     * const count = await prisma.wedding.count({
     *   where: {
     *     // ... the filter for the Weddings we want to count
     *   }
     * })
    **/
    count<T extends WeddingCountArgs>(
      args?: Subset<T, WeddingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeddingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WeddingAggregateArgs>(args: Subset<T, WeddingAggregateArgs>): Prisma.PrismaPromise<GetWeddingAggregateType<T>>

    /**
     * Group by Wedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WeddingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeddingGroupByArgs['orderBy'] }
        : { orderBy?: WeddingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WeddingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeddingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wedding model
   */
  readonly fields: WeddingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wedding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeddingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    events<T extends Wedding$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany"> | Null>
    rsvps<T extends Wedding$rsvpsArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$rsvpsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "findMany"> | Null>
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    theme<T extends ThemeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ThemeDefaultArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Wedding model
   */ 
  interface WeddingFieldRefs {
    readonly id: FieldRef<"Wedding", 'String'>
    readonly ownerId: FieldRef<"Wedding", 'String'>
    readonly themeId: FieldRef<"Wedding", 'String'>
    readonly groomName: FieldRef<"Wedding", 'String'>
    readonly brideName: FieldRef<"Wedding", 'String'>
    readonly groomParents: FieldRef<"Wedding", 'String'>
    readonly brideParents: FieldRef<"Wedding", 'String'>
    readonly rsvpContact: FieldRef<"Wedding", 'String'>
    readonly rsvpDeadline: FieldRef<"Wedding", 'DateTime'>
    readonly invitationMessage: FieldRef<"Wedding", 'String'>
    readonly createdAt: FieldRef<"Wedding", 'DateTime'>
    readonly updatedAt: FieldRef<"Wedding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Wedding findUnique
   */
  export type WeddingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Wedding to fetch.
     */
    where: WeddingWhereUniqueInput
  }

  /**
   * Wedding findUniqueOrThrow
   */
  export type WeddingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Wedding to fetch.
     */
    where: WeddingWhereUniqueInput
  }

  /**
   * Wedding findFirst
   */
  export type WeddingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Wedding to fetch.
     */
    where?: WeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weddings to fetch.
     */
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Weddings.
     */
    cursor?: WeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Weddings.
     */
    distinct?: WeddingScalarFieldEnum | WeddingScalarFieldEnum[]
  }

  /**
   * Wedding findFirstOrThrow
   */
  export type WeddingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Wedding to fetch.
     */
    where?: WeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weddings to fetch.
     */
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Weddings.
     */
    cursor?: WeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Weddings.
     */
    distinct?: WeddingScalarFieldEnum | WeddingScalarFieldEnum[]
  }

  /**
   * Wedding findMany
   */
  export type WeddingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Weddings to fetch.
     */
    where?: WeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weddings to fetch.
     */
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Weddings.
     */
    cursor?: WeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weddings.
     */
    skip?: number
    distinct?: WeddingScalarFieldEnum | WeddingScalarFieldEnum[]
  }

  /**
   * Wedding create
   */
  export type WeddingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * The data needed to create a Wedding.
     */
    data: XOR<WeddingCreateInput, WeddingUncheckedCreateInput>
  }

  /**
   * Wedding createMany
   */
  export type WeddingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Weddings.
     */
    data: WeddingCreateManyInput | WeddingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wedding createManyAndReturn
   */
  export type WeddingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Weddings.
     */
    data: WeddingCreateManyInput | WeddingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wedding update
   */
  export type WeddingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * The data needed to update a Wedding.
     */
    data: XOR<WeddingUpdateInput, WeddingUncheckedUpdateInput>
    /**
     * Choose, which Wedding to update.
     */
    where: WeddingWhereUniqueInput
  }

  /**
   * Wedding updateMany
   */
  export type WeddingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Weddings.
     */
    data: XOR<WeddingUpdateManyMutationInput, WeddingUncheckedUpdateManyInput>
    /**
     * Filter which Weddings to update
     */
    where?: WeddingWhereInput
  }

  /**
   * Wedding upsert
   */
  export type WeddingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * The filter to search for the Wedding to update in case it exists.
     */
    where: WeddingWhereUniqueInput
    /**
     * In case the Wedding found by the `where` argument doesn't exist, create a new Wedding with this data.
     */
    create: XOR<WeddingCreateInput, WeddingUncheckedCreateInput>
    /**
     * In case the Wedding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeddingUpdateInput, WeddingUncheckedUpdateInput>
  }

  /**
   * Wedding delete
   */
  export type WeddingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter which Wedding to delete.
     */
    where: WeddingWhereUniqueInput
  }

  /**
   * Wedding deleteMany
   */
  export type WeddingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Weddings to delete
     */
    where?: WeddingWhereInput
  }

  /**
   * Wedding.events
   */
  export type Wedding$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Wedding.rsvps
   */
  export type Wedding$rsvpsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    where?: RSVPWhereInput
    orderBy?: RSVPOrderByWithRelationInput | RSVPOrderByWithRelationInput[]
    cursor?: RSVPWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RSVPScalarFieldEnum | RSVPScalarFieldEnum[]
  }

  /**
   * Wedding without action
   */
  export type WeddingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    maxGuests: number | null
  }

  export type EventSumAggregateOutputType = {
    maxGuests: number | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    name: string | null
    date: string | null
    time: string | null
    venue: string | null
    mapLink: string | null
    description: string | null
    eventType: string | null
    rsvpDeadline: string | null
    allowCompanions: boolean | null
    collectDietary: boolean | null
    maxGuests: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    name: string | null
    date: string | null
    time: string | null
    venue: string | null
    mapLink: string | null
    description: string | null
    eventType: string | null
    rsvpDeadline: string | null
    allowCompanions: boolean | null
    collectDietary: boolean | null
    maxGuests: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    weddingId: number
    name: number
    date: number
    time: number
    venue: number
    mapLink: number
    description: number
    eventType: number
    rsvpDeadline: number
    allowCompanions: number
    collectDietary: number
    maxGuests: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    maxGuests?: true
  }

  export type EventSumAggregateInputType = {
    maxGuests?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    weddingId?: true
    name?: true
    date?: true
    time?: true
    venue?: true
    mapLink?: true
    description?: true
    eventType?: true
    rsvpDeadline?: true
    allowCompanions?: true
    collectDietary?: true
    maxGuests?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    weddingId?: true
    name?: true
    date?: true
    time?: true
    venue?: true
    mapLink?: true
    description?: true
    eventType?: true
    rsvpDeadline?: true
    allowCompanions?: true
    collectDietary?: true
    maxGuests?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    weddingId?: true
    name?: true
    date?: true
    time?: true
    venue?: true
    mapLink?: true
    description?: true
    eventType?: true
    rsvpDeadline?: true
    allowCompanions?: true
    collectDietary?: true
    maxGuests?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    weddingId: string
    name: string
    date: string
    time: string
    venue: string
    mapLink: string | null
    description: string | null
    eventType: string | null
    rsvpDeadline: string | null
    allowCompanions: boolean
    collectDietary: boolean
    maxGuests: number
    createdAt: Date
    updatedAt: Date
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    name?: boolean
    date?: boolean
    time?: boolean
    venue?: boolean
    mapLink?: boolean
    description?: boolean
    eventType?: boolean
    rsvpDeadline?: boolean
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    name?: boolean
    date?: boolean
    time?: boolean
    venue?: boolean
    mapLink?: boolean
    description?: boolean
    eventType?: boolean
    rsvpDeadline?: boolean
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    weddingId?: boolean
    name?: boolean
    date?: boolean
    time?: boolean
    venue?: boolean
    mapLink?: boolean
    description?: boolean
    eventType?: boolean
    rsvpDeadline?: boolean
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      name: string
      date: string
      time: string
      venue: string
      mapLink: string | null
      description: string | null
      eventType: string | null
      rsvpDeadline: string | null
      allowCompanions: boolean
      collectDietary: boolean
      maxGuests: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */ 
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly weddingId: FieldRef<"Event", 'String'>
    readonly name: FieldRef<"Event", 'String'>
    readonly date: FieldRef<"Event", 'String'>
    readonly time: FieldRef<"Event", 'String'>
    readonly venue: FieldRef<"Event", 'String'>
    readonly mapLink: FieldRef<"Event", 'String'>
    readonly description: FieldRef<"Event", 'String'>
    readonly eventType: FieldRef<"Event", 'String'>
    readonly rsvpDeadline: FieldRef<"Event", 'String'>
    readonly allowCompanions: FieldRef<"Event", 'Boolean'>
    readonly collectDietary: FieldRef<"Event", 'Boolean'>
    readonly maxGuests: FieldRef<"Event", 'Int'>
    readonly createdAt: FieldRef<"Event", 'DateTime'>
    readonly updatedAt: FieldRef<"Event", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model RSVP
   */

  export type AggregateRSVP = {
    _count: RSVPCountAggregateOutputType | null
    _avg: RSVPAvgAggregateOutputType | null
    _sum: RSVPSumAggregateOutputType | null
    _min: RSVPMinAggregateOutputType | null
    _max: RSVPMaxAggregateOutputType | null
  }

  export type RSVPAvgAggregateOutputType = {
    adultCount: number | null
    childCount: number | null
  }

  export type RSVPSumAggregateOutputType = {
    adultCount: number | null
    childCount: number | null
  }

  export type RSVPMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    guestName: string | null
    phone: string | null
    adultCount: number | null
    childCount: number | null
    attending: boolean | null
    status: string | null
    dietary: string | null
    message: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RSVPMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    guestName: string | null
    phone: string | null
    adultCount: number | null
    childCount: number | null
    attending: boolean | null
    status: string | null
    dietary: string | null
    message: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RSVPCountAggregateOutputType = {
    id: number
    weddingId: number
    guestName: number
    phone: number
    adultCount: number
    childCount: number
    attending: number
    status: number
    dietary: number
    message: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RSVPAvgAggregateInputType = {
    adultCount?: true
    childCount?: true
  }

  export type RSVPSumAggregateInputType = {
    adultCount?: true
    childCount?: true
  }

  export type RSVPMinAggregateInputType = {
    id?: true
    weddingId?: true
    guestName?: true
    phone?: true
    adultCount?: true
    childCount?: true
    attending?: true
    status?: true
    dietary?: true
    message?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RSVPMaxAggregateInputType = {
    id?: true
    weddingId?: true
    guestName?: true
    phone?: true
    adultCount?: true
    childCount?: true
    attending?: true
    status?: true
    dietary?: true
    message?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RSVPCountAggregateInputType = {
    id?: true
    weddingId?: true
    guestName?: true
    phone?: true
    adultCount?: true
    childCount?: true
    attending?: true
    status?: true
    dietary?: true
    message?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RSVPAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RSVP to aggregate.
     */
    where?: RSVPWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RSVPS to fetch.
     */
    orderBy?: RSVPOrderByWithRelationInput | RSVPOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RSVPWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RSVPS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RSVPS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RSVPS
    **/
    _count?: true | RSVPCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RSVPAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RSVPSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RSVPMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RSVPMaxAggregateInputType
  }

  export type GetRSVPAggregateType<T extends RSVPAggregateArgs> = {
        [P in keyof T & keyof AggregateRSVP]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRSVP[P]>
      : GetScalarType<T[P], AggregateRSVP[P]>
  }




  export type RSVPGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RSVPWhereInput
    orderBy?: RSVPOrderByWithAggregationInput | RSVPOrderByWithAggregationInput[]
    by: RSVPScalarFieldEnum[] | RSVPScalarFieldEnum
    having?: RSVPScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RSVPCountAggregateInputType | true
    _avg?: RSVPAvgAggregateInputType
    _sum?: RSVPSumAggregateInputType
    _min?: RSVPMinAggregateInputType
    _max?: RSVPMaxAggregateInputType
  }

  export type RSVPGroupByOutputType = {
    id: string
    weddingId: string
    guestName: string
    phone: string | null
    adultCount: number
    childCount: number
    attending: boolean
    status: string
    dietary: string | null
    message: string | null
    createdAt: Date
    updatedAt: Date
    _count: RSVPCountAggregateOutputType | null
    _avg: RSVPAvgAggregateOutputType | null
    _sum: RSVPSumAggregateOutputType | null
    _min: RSVPMinAggregateOutputType | null
    _max: RSVPMaxAggregateOutputType | null
  }

  type GetRSVPGroupByPayload<T extends RSVPGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RSVPGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RSVPGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RSVPGroupByOutputType[P]>
            : GetScalarType<T[P], RSVPGroupByOutputType[P]>
        }
      >
    >


  export type RSVPSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    guestName?: boolean
    phone?: boolean
    adultCount?: boolean
    childCount?: boolean
    attending?: boolean
    status?: boolean
    dietary?: boolean
    message?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rSVP"]>

  export type RSVPSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    guestName?: boolean
    phone?: boolean
    adultCount?: boolean
    childCount?: boolean
    attending?: boolean
    status?: boolean
    dietary?: boolean
    message?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rSVP"]>

  export type RSVPSelectScalar = {
    id?: boolean
    weddingId?: boolean
    guestName?: boolean
    phone?: boolean
    adultCount?: boolean
    childCount?: boolean
    attending?: boolean
    status?: boolean
    dietary?: boolean
    message?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RSVPInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type RSVPIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }

  export type $RSVPPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RSVP"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      guestName: string
      phone: string | null
      adultCount: number
      childCount: number
      attending: boolean
      status: string
      dietary: string | null
      message: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rSVP"]>
    composites: {}
  }

  type RSVPGetPayload<S extends boolean | null | undefined | RSVPDefaultArgs> = $Result.GetResult<Prisma.$RSVPPayload, S>

  type RSVPCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RSVPFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RSVPCountAggregateInputType | true
    }

  export interface RSVPDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RSVP'], meta: { name: 'RSVP' } }
    /**
     * Find zero or one RSVP that matches the filter.
     * @param {RSVPFindUniqueArgs} args - Arguments to find a RSVP
     * @example
     * // Get one RSVP
     * const rSVP = await prisma.rSVP.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RSVPFindUniqueArgs>(args: SelectSubset<T, RSVPFindUniqueArgs<ExtArgs>>): Prisma__RSVPClient<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RSVP that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RSVPFindUniqueOrThrowArgs} args - Arguments to find a RSVP
     * @example
     * // Get one RSVP
     * const rSVP = await prisma.rSVP.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RSVPFindUniqueOrThrowArgs>(args: SelectSubset<T, RSVPFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RSVPClient<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RSVP that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RSVPFindFirstArgs} args - Arguments to find a RSVP
     * @example
     * // Get one RSVP
     * const rSVP = await prisma.rSVP.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RSVPFindFirstArgs>(args?: SelectSubset<T, RSVPFindFirstArgs<ExtArgs>>): Prisma__RSVPClient<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RSVP that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RSVPFindFirstOrThrowArgs} args - Arguments to find a RSVP
     * @example
     * // Get one RSVP
     * const rSVP = await prisma.rSVP.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RSVPFindFirstOrThrowArgs>(args?: SelectSubset<T, RSVPFindFirstOrThrowArgs<ExtArgs>>): Prisma__RSVPClient<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RSVPS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RSVPFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RSVPS
     * const rSVPS = await prisma.rSVP.findMany()
     * 
     * // Get first 10 RSVPS
     * const rSVPS = await prisma.rSVP.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rSVPWithIdOnly = await prisma.rSVP.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RSVPFindManyArgs>(args?: SelectSubset<T, RSVPFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RSVP.
     * @param {RSVPCreateArgs} args - Arguments to create a RSVP.
     * @example
     * // Create one RSVP
     * const RSVP = await prisma.rSVP.create({
     *   data: {
     *     // ... data to create a RSVP
     *   }
     * })
     * 
     */
    create<T extends RSVPCreateArgs>(args: SelectSubset<T, RSVPCreateArgs<ExtArgs>>): Prisma__RSVPClient<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RSVPS.
     * @param {RSVPCreateManyArgs} args - Arguments to create many RSVPS.
     * @example
     * // Create many RSVPS
     * const rSVP = await prisma.rSVP.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RSVPCreateManyArgs>(args?: SelectSubset<T, RSVPCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RSVPS and returns the data saved in the database.
     * @param {RSVPCreateManyAndReturnArgs} args - Arguments to create many RSVPS.
     * @example
     * // Create many RSVPS
     * const rSVP = await prisma.rSVP.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RSVPS and only return the `id`
     * const rSVPWithIdOnly = await prisma.rSVP.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RSVPCreateManyAndReturnArgs>(args?: SelectSubset<T, RSVPCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RSVP.
     * @param {RSVPDeleteArgs} args - Arguments to delete one RSVP.
     * @example
     * // Delete one RSVP
     * const RSVP = await prisma.rSVP.delete({
     *   where: {
     *     // ... filter to delete one RSVP
     *   }
     * })
     * 
     */
    delete<T extends RSVPDeleteArgs>(args: SelectSubset<T, RSVPDeleteArgs<ExtArgs>>): Prisma__RSVPClient<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RSVP.
     * @param {RSVPUpdateArgs} args - Arguments to update one RSVP.
     * @example
     * // Update one RSVP
     * const rSVP = await prisma.rSVP.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RSVPUpdateArgs>(args: SelectSubset<T, RSVPUpdateArgs<ExtArgs>>): Prisma__RSVPClient<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RSVPS.
     * @param {RSVPDeleteManyArgs} args - Arguments to filter RSVPS to delete.
     * @example
     * // Delete a few RSVPS
     * const { count } = await prisma.rSVP.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RSVPDeleteManyArgs>(args?: SelectSubset<T, RSVPDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RSVPS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RSVPUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RSVPS
     * const rSVP = await prisma.rSVP.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RSVPUpdateManyArgs>(args: SelectSubset<T, RSVPUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RSVP.
     * @param {RSVPUpsertArgs} args - Arguments to update or create a RSVP.
     * @example
     * // Update or create a RSVP
     * const rSVP = await prisma.rSVP.upsert({
     *   create: {
     *     // ... data to create a RSVP
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RSVP we want to update
     *   }
     * })
     */
    upsert<T extends RSVPUpsertArgs>(args: SelectSubset<T, RSVPUpsertArgs<ExtArgs>>): Prisma__RSVPClient<$Result.GetResult<Prisma.$RSVPPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RSVPS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RSVPCountArgs} args - Arguments to filter RSVPS to count.
     * @example
     * // Count the number of RSVPS
     * const count = await prisma.rSVP.count({
     *   where: {
     *     // ... the filter for the RSVPS we want to count
     *   }
     * })
    **/
    count<T extends RSVPCountArgs>(
      args?: Subset<T, RSVPCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RSVPCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RSVP.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RSVPAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RSVPAggregateArgs>(args: Subset<T, RSVPAggregateArgs>): Prisma.PrismaPromise<GetRSVPAggregateType<T>>

    /**
     * Group by RSVP.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RSVPGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RSVPGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RSVPGroupByArgs['orderBy'] }
        : { orderBy?: RSVPGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RSVPGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRSVPGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RSVP model
   */
  readonly fields: RSVPFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RSVP.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RSVPClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RSVP model
   */ 
  interface RSVPFieldRefs {
    readonly id: FieldRef<"RSVP", 'String'>
    readonly weddingId: FieldRef<"RSVP", 'String'>
    readonly guestName: FieldRef<"RSVP", 'String'>
    readonly phone: FieldRef<"RSVP", 'String'>
    readonly adultCount: FieldRef<"RSVP", 'Int'>
    readonly childCount: FieldRef<"RSVP", 'Int'>
    readonly attending: FieldRef<"RSVP", 'Boolean'>
    readonly status: FieldRef<"RSVP", 'String'>
    readonly dietary: FieldRef<"RSVP", 'String'>
    readonly message: FieldRef<"RSVP", 'String'>
    readonly createdAt: FieldRef<"RSVP", 'DateTime'>
    readonly updatedAt: FieldRef<"RSVP", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RSVP findUnique
   */
  export type RSVPFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * Filter, which RSVP to fetch.
     */
    where: RSVPWhereUniqueInput
  }

  /**
   * RSVP findUniqueOrThrow
   */
  export type RSVPFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * Filter, which RSVP to fetch.
     */
    where: RSVPWhereUniqueInput
  }

  /**
   * RSVP findFirst
   */
  export type RSVPFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * Filter, which RSVP to fetch.
     */
    where?: RSVPWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RSVPS to fetch.
     */
    orderBy?: RSVPOrderByWithRelationInput | RSVPOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RSVPS.
     */
    cursor?: RSVPWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RSVPS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RSVPS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RSVPS.
     */
    distinct?: RSVPScalarFieldEnum | RSVPScalarFieldEnum[]
  }

  /**
   * RSVP findFirstOrThrow
   */
  export type RSVPFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * Filter, which RSVP to fetch.
     */
    where?: RSVPWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RSVPS to fetch.
     */
    orderBy?: RSVPOrderByWithRelationInput | RSVPOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RSVPS.
     */
    cursor?: RSVPWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RSVPS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RSVPS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RSVPS.
     */
    distinct?: RSVPScalarFieldEnum | RSVPScalarFieldEnum[]
  }

  /**
   * RSVP findMany
   */
  export type RSVPFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * Filter, which RSVPS to fetch.
     */
    where?: RSVPWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RSVPS to fetch.
     */
    orderBy?: RSVPOrderByWithRelationInput | RSVPOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RSVPS.
     */
    cursor?: RSVPWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RSVPS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RSVPS.
     */
    skip?: number
    distinct?: RSVPScalarFieldEnum | RSVPScalarFieldEnum[]
  }

  /**
   * RSVP create
   */
  export type RSVPCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * The data needed to create a RSVP.
     */
    data: XOR<RSVPCreateInput, RSVPUncheckedCreateInput>
  }

  /**
   * RSVP createMany
   */
  export type RSVPCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RSVPS.
     */
    data: RSVPCreateManyInput | RSVPCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RSVP createManyAndReturn
   */
  export type RSVPCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RSVPS.
     */
    data: RSVPCreateManyInput | RSVPCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RSVP update
   */
  export type RSVPUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * The data needed to update a RSVP.
     */
    data: XOR<RSVPUpdateInput, RSVPUncheckedUpdateInput>
    /**
     * Choose, which RSVP to update.
     */
    where: RSVPWhereUniqueInput
  }

  /**
   * RSVP updateMany
   */
  export type RSVPUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RSVPS.
     */
    data: XOR<RSVPUpdateManyMutationInput, RSVPUncheckedUpdateManyInput>
    /**
     * Filter which RSVPS to update
     */
    where?: RSVPWhereInput
  }

  /**
   * RSVP upsert
   */
  export type RSVPUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * The filter to search for the RSVP to update in case it exists.
     */
    where: RSVPWhereUniqueInput
    /**
     * In case the RSVP found by the `where` argument doesn't exist, create a new RSVP with this data.
     */
    create: XOR<RSVPCreateInput, RSVPUncheckedCreateInput>
    /**
     * In case the RSVP was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RSVPUpdateInput, RSVPUncheckedUpdateInput>
  }

  /**
   * RSVP delete
   */
  export type RSVPDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
    /**
     * Filter which RSVP to delete.
     */
    where: RSVPWhereUniqueInput
  }

  /**
   * RSVP deleteMany
   */
  export type RSVPDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RSVPS to delete
     */
    where?: RSVPWhereInput
  }

  /**
   * RSVP without action
   */
  export type RSVPDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RSVP
     */
    select?: RSVPSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RSVPInclude<ExtArgs> | null
  }


  /**
   * Model Package
   */

  export type AggregatePackage = {
    _count: PackageCountAggregateOutputType | null
    _avg: PackageAvgAggregateOutputType | null
    _sum: PackageSumAggregateOutputType | null
    _min: PackageMinAggregateOutputType | null
    _max: PackageMaxAggregateOutputType | null
  }

  export type PackageAvgAggregateOutputType = {
    price: number | null
    level: number | null
  }

  export type PackageSumAggregateOutputType = {
    price: number | null
    level: number | null
  }

  export type PackageMinAggregateOutputType = {
    id: string | null
    name: string | null
    price: number | null
    level: number | null
    allowedItems: string | null
    isActive: boolean | null
    whatYouGet: string | null
    productHighlights: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageMaxAggregateOutputType = {
    id: string | null
    name: string | null
    price: number | null
    level: number | null
    allowedItems: string | null
    isActive: boolean | null
    whatYouGet: string | null
    productHighlights: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageCountAggregateOutputType = {
    id: number
    name: number
    price: number
    level: number
    allowedItems: number
    isActive: number
    whatYouGet: number
    productHighlights: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PackageAvgAggregateInputType = {
    price?: true
    level?: true
  }

  export type PackageSumAggregateInputType = {
    price?: true
    level?: true
  }

  export type PackageMinAggregateInputType = {
    id?: true
    name?: true
    price?: true
    level?: true
    allowedItems?: true
    isActive?: true
    whatYouGet?: true
    productHighlights?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageMaxAggregateInputType = {
    id?: true
    name?: true
    price?: true
    level?: true
    allowedItems?: true
    isActive?: true
    whatYouGet?: true
    productHighlights?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageCountAggregateInputType = {
    id?: true
    name?: true
    price?: true
    level?: true
    allowedItems?: true
    isActive?: true
    whatYouGet?: true
    productHighlights?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PackageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Package to aggregate.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Packages
    **/
    _count?: true | PackageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PackageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PackageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PackageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PackageMaxAggregateInputType
  }

  export type GetPackageAggregateType<T extends PackageAggregateArgs> = {
        [P in keyof T & keyof AggregatePackage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePackage[P]>
      : GetScalarType<T[P], AggregatePackage[P]>
  }




  export type PackageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PackageWhereInput
    orderBy?: PackageOrderByWithAggregationInput | PackageOrderByWithAggregationInput[]
    by: PackageScalarFieldEnum[] | PackageScalarFieldEnum
    having?: PackageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PackageCountAggregateInputType | true
    _avg?: PackageAvgAggregateInputType
    _sum?: PackageSumAggregateInputType
    _min?: PackageMinAggregateInputType
    _max?: PackageMaxAggregateInputType
  }

  export type PackageGroupByOutputType = {
    id: string
    name: string
    price: number
    level: number
    allowedItems: string
    isActive: boolean
    whatYouGet: string | null
    productHighlights: string | null
    createdAt: Date
    updatedAt: Date
    _count: PackageCountAggregateOutputType | null
    _avg: PackageAvgAggregateOutputType | null
    _sum: PackageSumAggregateOutputType | null
    _min: PackageMinAggregateOutputType | null
    _max: PackageMaxAggregateOutputType | null
  }

  type GetPackageGroupByPayload<T extends PackageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PackageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PackageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PackageGroupByOutputType[P]>
            : GetScalarType<T[P], PackageGroupByOutputType[P]>
        }
      >
    >


  export type PackageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    level?: boolean
    allowedItems?: boolean
    isActive?: boolean
    whatYouGet?: boolean
    productHighlights?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["package"]>

  export type PackageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    level?: boolean
    allowedItems?: boolean
    isActive?: boolean
    whatYouGet?: boolean
    productHighlights?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["package"]>

  export type PackageSelectScalar = {
    id?: boolean
    name?: boolean
    price?: boolean
    level?: boolean
    allowedItems?: boolean
    isActive?: boolean
    whatYouGet?: boolean
    productHighlights?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $PackagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Package"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      price: number
      level: number
      allowedItems: string
      isActive: boolean
      whatYouGet: string | null
      productHighlights: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["package"]>
    composites: {}
  }

  type PackageGetPayload<S extends boolean | null | undefined | PackageDefaultArgs> = $Result.GetResult<Prisma.$PackagePayload, S>

  type PackageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PackageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PackageCountAggregateInputType | true
    }

  export interface PackageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Package'], meta: { name: 'Package' } }
    /**
     * Find zero or one Package that matches the filter.
     * @param {PackageFindUniqueArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PackageFindUniqueArgs>(args: SelectSubset<T, PackageFindUniqueArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Package that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PackageFindUniqueOrThrowArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PackageFindUniqueOrThrowArgs>(args: SelectSubset<T, PackageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Package that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindFirstArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PackageFindFirstArgs>(args?: SelectSubset<T, PackageFindFirstArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Package that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindFirstOrThrowArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PackageFindFirstOrThrowArgs>(args?: SelectSubset<T, PackageFindFirstOrThrowArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Packages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Packages
     * const packages = await prisma.package.findMany()
     * 
     * // Get first 10 Packages
     * const packages = await prisma.package.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const packageWithIdOnly = await prisma.package.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PackageFindManyArgs>(args?: SelectSubset<T, PackageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Package.
     * @param {PackageCreateArgs} args - Arguments to create a Package.
     * @example
     * // Create one Package
     * const Package = await prisma.package.create({
     *   data: {
     *     // ... data to create a Package
     *   }
     * })
     * 
     */
    create<T extends PackageCreateArgs>(args: SelectSubset<T, PackageCreateArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Packages.
     * @param {PackageCreateManyArgs} args - Arguments to create many Packages.
     * @example
     * // Create many Packages
     * const package = await prisma.package.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PackageCreateManyArgs>(args?: SelectSubset<T, PackageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Packages and returns the data saved in the database.
     * @param {PackageCreateManyAndReturnArgs} args - Arguments to create many Packages.
     * @example
     * // Create many Packages
     * const package = await prisma.package.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Packages and only return the `id`
     * const packageWithIdOnly = await prisma.package.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PackageCreateManyAndReturnArgs>(args?: SelectSubset<T, PackageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Package.
     * @param {PackageDeleteArgs} args - Arguments to delete one Package.
     * @example
     * // Delete one Package
     * const Package = await prisma.package.delete({
     *   where: {
     *     // ... filter to delete one Package
     *   }
     * })
     * 
     */
    delete<T extends PackageDeleteArgs>(args: SelectSubset<T, PackageDeleteArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Package.
     * @param {PackageUpdateArgs} args - Arguments to update one Package.
     * @example
     * // Update one Package
     * const package = await prisma.package.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PackageUpdateArgs>(args: SelectSubset<T, PackageUpdateArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Packages.
     * @param {PackageDeleteManyArgs} args - Arguments to filter Packages to delete.
     * @example
     * // Delete a few Packages
     * const { count } = await prisma.package.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PackageDeleteManyArgs>(args?: SelectSubset<T, PackageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Packages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Packages
     * const package = await prisma.package.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PackageUpdateManyArgs>(args: SelectSubset<T, PackageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Package.
     * @param {PackageUpsertArgs} args - Arguments to update or create a Package.
     * @example
     * // Update or create a Package
     * const package = await prisma.package.upsert({
     *   create: {
     *     // ... data to create a Package
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Package we want to update
     *   }
     * })
     */
    upsert<T extends PackageUpsertArgs>(args: SelectSubset<T, PackageUpsertArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Packages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageCountArgs} args - Arguments to filter Packages to count.
     * @example
     * // Count the number of Packages
     * const count = await prisma.package.count({
     *   where: {
     *     // ... the filter for the Packages we want to count
     *   }
     * })
    **/
    count<T extends PackageCountArgs>(
      args?: Subset<T, PackageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PackageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Package.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PackageAggregateArgs>(args: Subset<T, PackageAggregateArgs>): Prisma.PrismaPromise<GetPackageAggregateType<T>>

    /**
     * Group by Package.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PackageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PackageGroupByArgs['orderBy'] }
        : { orderBy?: PackageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PackageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPackageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Package model
   */
  readonly fields: PackageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Package.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PackageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Package model
   */ 
  interface PackageFieldRefs {
    readonly id: FieldRef<"Package", 'String'>
    readonly name: FieldRef<"Package", 'String'>
    readonly price: FieldRef<"Package", 'Int'>
    readonly level: FieldRef<"Package", 'Int'>
    readonly allowedItems: FieldRef<"Package", 'String'>
    readonly isActive: FieldRef<"Package", 'Boolean'>
    readonly whatYouGet: FieldRef<"Package", 'String'>
    readonly productHighlights: FieldRef<"Package", 'String'>
    readonly createdAt: FieldRef<"Package", 'DateTime'>
    readonly updatedAt: FieldRef<"Package", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Package findUnique
   */
  export type PackageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package findUniqueOrThrow
   */
  export type PackageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package findFirst
   */
  export type PackageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Packages.
     */
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package findFirstOrThrow
   */
  export type PackageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Packages.
     */
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package findMany
   */
  export type PackageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Filter, which Packages to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package create
   */
  export type PackageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * The data needed to create a Package.
     */
    data: XOR<PackageCreateInput, PackageUncheckedCreateInput>
  }

  /**
   * Package createMany
   */
  export type PackageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Packages.
     */
    data: PackageCreateManyInput | PackageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Package createManyAndReturn
   */
  export type PackageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Packages.
     */
    data: PackageCreateManyInput | PackageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Package update
   */
  export type PackageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * The data needed to update a Package.
     */
    data: XOR<PackageUpdateInput, PackageUncheckedUpdateInput>
    /**
     * Choose, which Package to update.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package updateMany
   */
  export type PackageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Packages.
     */
    data: XOR<PackageUpdateManyMutationInput, PackageUncheckedUpdateManyInput>
    /**
     * Filter which Packages to update
     */
    where?: PackageWhereInput
  }

  /**
   * Package upsert
   */
  export type PackageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * The filter to search for the Package to update in case it exists.
     */
    where: PackageWhereUniqueInput
    /**
     * In case the Package found by the `where` argument doesn't exist, create a new Package with this data.
     */
    create: XOR<PackageCreateInput, PackageUncheckedCreateInput>
    /**
     * In case the Package was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PackageUpdateInput, PackageUncheckedUpdateInput>
  }

  /**
   * Package delete
   */
  export type PackageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Filter which Package to delete.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package deleteMany
   */
  export type PackageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Packages to delete
     */
    where?: PackageWhereInput
  }

  /**
   * Package without action
   */
  export type PackageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isMobileVerified: 'isMobileVerified',
    mobileNumber: 'mobileNumber',
    role: 'role',
    status: 'status'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OTPRequestScalarFieldEnum: {
    id: 'id',
    mobileNumber: 'mobileNumber',
    otpHash: 'otpHash',
    expiresAt: 'expiresAt',
    isUsed: 'isUsed',
    attemptCount: 'attemptCount',
    createdAt: 'createdAt'
  };

  export type OTPRequestScalarFieldEnum = (typeof OTPRequestScalarFieldEnum)[keyof typeof OTPRequestScalarFieldEnum]


  export const BundleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    whatsappPrice: 'whatsappPrice',
    printablePrice: 'printablePrice',
    completePrice: 'completePrice',
    isPopular: 'isPopular',
    theme: 'theme',
    description: 'description',
    isActive: 'isActive',
    themeId: 'themeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    previewImages: 'previewImages',
    thumbnailUrl: 'thumbnailUrl',
    itemImages: 'itemImages'
  };

  export type BundleScalarFieldEnum = (typeof BundleScalarFieldEnum)[keyof typeof BundleScalarFieldEnum]


  export const BundleItemScalarFieldEnum: {
    id: 'id',
    bundleId: 'bundleId',
    eventType: 'eventType',
    templateName: 'templateName',
    templateFile: 'templateFile',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BundleItemScalarFieldEnum = (typeof BundleItemScalarFieldEnum)[keyof typeof BundleItemScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    bundleId: 'bundleId',
    totalAmount: 'totalAmount',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const ThemeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    thumbnailUrl: 'thumbnailUrl',
    previewImages: 'previewImages',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isBestSeller: 'isBestSeller',
    isPopular: 'isPopular'
  };

  export type ThemeScalarFieldEnum = (typeof ThemeScalarFieldEnum)[keyof typeof ThemeScalarFieldEnum]


  export const WeddingScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    themeId: 'themeId',
    groomName: 'groomName',
    brideName: 'brideName',
    groomParents: 'groomParents',
    brideParents: 'brideParents',
    rsvpContact: 'rsvpContact',
    rsvpDeadline: 'rsvpDeadline',
    invitationMessage: 'invitationMessage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WeddingScalarFieldEnum = (typeof WeddingScalarFieldEnum)[keyof typeof WeddingScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    name: 'name',
    date: 'date',
    time: 'time',
    venue: 'venue',
    mapLink: 'mapLink',
    description: 'description',
    eventType: 'eventType',
    rsvpDeadline: 'rsvpDeadline',
    allowCompanions: 'allowCompanions',
    collectDietary: 'collectDietary',
    maxGuests: 'maxGuests',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const RSVPScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    guestName: 'guestName',
    phone: 'phone',
    adultCount: 'adultCount',
    childCount: 'childCount',
    attending: 'attending',
    status: 'status',
    dietary: 'dietary',
    message: 'message',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RSVPScalarFieldEnum = (typeof RSVPScalarFieldEnum)[keyof typeof RSVPScalarFieldEnum]


  export const PackageScalarFieldEnum: {
    id: 'id',
    name: 'name',
    price: 'price',
    level: 'level',
    allowedItems: 'allowedItems',
    isActive: 'isActive',
    whatYouGet: 'whatYouGet',
    productHighlights: 'productHighlights',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PackageScalarFieldEnum = (typeof PackageScalarFieldEnum)[keyof typeof PackageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    isMobileVerified?: BoolFilter<"User"> | boolean
    mobileNumber?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    orders?: OrderListRelationFilter
    weddings?: WeddingListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isMobileVerified?: SortOrder
    mobileNumber?: SortOrder
    role?: SortOrder
    status?: SortOrder
    orders?: OrderOrderByRelationAggregateInput
    weddings?: WeddingOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    mobileNumber?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    isMobileVerified?: BoolFilter<"User"> | boolean
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    orders?: OrderListRelationFilter
    weddings?: WeddingListRelationFilter
  }, "id" | "email" | "mobileNumber">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isMobileVerified?: SortOrder
    mobileNumber?: SortOrder
    role?: SortOrder
    status?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    isMobileVerified?: BoolWithAggregatesFilter<"User"> | boolean
    mobileNumber?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    status?: StringWithAggregatesFilter<"User"> | string
  }

  export type OTPRequestWhereInput = {
    AND?: OTPRequestWhereInput | OTPRequestWhereInput[]
    OR?: OTPRequestWhereInput[]
    NOT?: OTPRequestWhereInput | OTPRequestWhereInput[]
    id?: StringFilter<"OTPRequest"> | string
    mobileNumber?: StringFilter<"OTPRequest"> | string
    otpHash?: StringFilter<"OTPRequest"> | string
    expiresAt?: DateTimeFilter<"OTPRequest"> | Date | string
    isUsed?: BoolFilter<"OTPRequest"> | boolean
    attemptCount?: IntFilter<"OTPRequest"> | number
    createdAt?: DateTimeFilter<"OTPRequest"> | Date | string
  }

  export type OTPRequestOrderByWithRelationInput = {
    id?: SortOrder
    mobileNumber?: SortOrder
    otpHash?: SortOrder
    expiresAt?: SortOrder
    isUsed?: SortOrder
    attemptCount?: SortOrder
    createdAt?: SortOrder
  }

  export type OTPRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OTPRequestWhereInput | OTPRequestWhereInput[]
    OR?: OTPRequestWhereInput[]
    NOT?: OTPRequestWhereInput | OTPRequestWhereInput[]
    mobileNumber?: StringFilter<"OTPRequest"> | string
    otpHash?: StringFilter<"OTPRequest"> | string
    expiresAt?: DateTimeFilter<"OTPRequest"> | Date | string
    isUsed?: BoolFilter<"OTPRequest"> | boolean
    attemptCount?: IntFilter<"OTPRequest"> | number
    createdAt?: DateTimeFilter<"OTPRequest"> | Date | string
  }, "id">

  export type OTPRequestOrderByWithAggregationInput = {
    id?: SortOrder
    mobileNumber?: SortOrder
    otpHash?: SortOrder
    expiresAt?: SortOrder
    isUsed?: SortOrder
    attemptCount?: SortOrder
    createdAt?: SortOrder
    _count?: OTPRequestCountOrderByAggregateInput
    _avg?: OTPRequestAvgOrderByAggregateInput
    _max?: OTPRequestMaxOrderByAggregateInput
    _min?: OTPRequestMinOrderByAggregateInput
    _sum?: OTPRequestSumOrderByAggregateInput
  }

  export type OTPRequestScalarWhereWithAggregatesInput = {
    AND?: OTPRequestScalarWhereWithAggregatesInput | OTPRequestScalarWhereWithAggregatesInput[]
    OR?: OTPRequestScalarWhereWithAggregatesInput[]
    NOT?: OTPRequestScalarWhereWithAggregatesInput | OTPRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OTPRequest"> | string
    mobileNumber?: StringWithAggregatesFilter<"OTPRequest"> | string
    otpHash?: StringWithAggregatesFilter<"OTPRequest"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"OTPRequest"> | Date | string
    isUsed?: BoolWithAggregatesFilter<"OTPRequest"> | boolean
    attemptCount?: IntWithAggregatesFilter<"OTPRequest"> | number
    createdAt?: DateTimeWithAggregatesFilter<"OTPRequest"> | Date | string
  }

  export type BundleWhereInput = {
    AND?: BundleWhereInput | BundleWhereInput[]
    OR?: BundleWhereInput[]
    NOT?: BundleWhereInput | BundleWhereInput[]
    id?: StringFilter<"Bundle"> | string
    name?: StringFilter<"Bundle"> | string
    whatsappPrice?: IntFilter<"Bundle"> | number
    printablePrice?: IntFilter<"Bundle"> | number
    completePrice?: IntFilter<"Bundle"> | number
    isPopular?: BoolFilter<"Bundle"> | boolean
    theme?: StringFilter<"Bundle"> | string
    description?: StringNullableFilter<"Bundle"> | string | null
    isActive?: BoolFilter<"Bundle"> | boolean
    themeId?: StringNullableFilter<"Bundle"> | string | null
    createdAt?: DateTimeFilter<"Bundle"> | Date | string
    updatedAt?: DateTimeFilter<"Bundle"> | Date | string
    previewImages?: StringNullableFilter<"Bundle"> | string | null
    thumbnailUrl?: StringNullableFilter<"Bundle"> | string | null
    itemImages?: StringNullableFilter<"Bundle"> | string | null
    themeRef?: XOR<ThemeNullableRelationFilter, ThemeWhereInput> | null
    orders?: OrderListRelationFilter
    bundleItems?: BundleItemListRelationFilter
  }

  export type BundleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    whatsappPrice?: SortOrder
    printablePrice?: SortOrder
    completePrice?: SortOrder
    isPopular?: SortOrder
    theme?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    themeId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    previewImages?: SortOrderInput | SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    itemImages?: SortOrderInput | SortOrder
    themeRef?: ThemeOrderByWithRelationInput
    orders?: OrderOrderByRelationAggregateInput
    bundleItems?: BundleItemOrderByRelationAggregateInput
  }

  export type BundleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BundleWhereInput | BundleWhereInput[]
    OR?: BundleWhereInput[]
    NOT?: BundleWhereInput | BundleWhereInput[]
    name?: StringFilter<"Bundle"> | string
    whatsappPrice?: IntFilter<"Bundle"> | number
    printablePrice?: IntFilter<"Bundle"> | number
    completePrice?: IntFilter<"Bundle"> | number
    isPopular?: BoolFilter<"Bundle"> | boolean
    theme?: StringFilter<"Bundle"> | string
    description?: StringNullableFilter<"Bundle"> | string | null
    isActive?: BoolFilter<"Bundle"> | boolean
    themeId?: StringNullableFilter<"Bundle"> | string | null
    createdAt?: DateTimeFilter<"Bundle"> | Date | string
    updatedAt?: DateTimeFilter<"Bundle"> | Date | string
    previewImages?: StringNullableFilter<"Bundle"> | string | null
    thumbnailUrl?: StringNullableFilter<"Bundle"> | string | null
    itemImages?: StringNullableFilter<"Bundle"> | string | null
    themeRef?: XOR<ThemeNullableRelationFilter, ThemeWhereInput> | null
    orders?: OrderListRelationFilter
    bundleItems?: BundleItemListRelationFilter
  }, "id">

  export type BundleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    whatsappPrice?: SortOrder
    printablePrice?: SortOrder
    completePrice?: SortOrder
    isPopular?: SortOrder
    theme?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    themeId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    previewImages?: SortOrderInput | SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    itemImages?: SortOrderInput | SortOrder
    _count?: BundleCountOrderByAggregateInput
    _avg?: BundleAvgOrderByAggregateInput
    _max?: BundleMaxOrderByAggregateInput
    _min?: BundleMinOrderByAggregateInput
    _sum?: BundleSumOrderByAggregateInput
  }

  export type BundleScalarWhereWithAggregatesInput = {
    AND?: BundleScalarWhereWithAggregatesInput | BundleScalarWhereWithAggregatesInput[]
    OR?: BundleScalarWhereWithAggregatesInput[]
    NOT?: BundleScalarWhereWithAggregatesInput | BundleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bundle"> | string
    name?: StringWithAggregatesFilter<"Bundle"> | string
    whatsappPrice?: IntWithAggregatesFilter<"Bundle"> | number
    printablePrice?: IntWithAggregatesFilter<"Bundle"> | number
    completePrice?: IntWithAggregatesFilter<"Bundle"> | number
    isPopular?: BoolWithAggregatesFilter<"Bundle"> | boolean
    theme?: StringWithAggregatesFilter<"Bundle"> | string
    description?: StringNullableWithAggregatesFilter<"Bundle"> | string | null
    isActive?: BoolWithAggregatesFilter<"Bundle"> | boolean
    themeId?: StringNullableWithAggregatesFilter<"Bundle"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Bundle"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Bundle"> | Date | string
    previewImages?: StringNullableWithAggregatesFilter<"Bundle"> | string | null
    thumbnailUrl?: StringNullableWithAggregatesFilter<"Bundle"> | string | null
    itemImages?: StringNullableWithAggregatesFilter<"Bundle"> | string | null
  }

  export type BundleItemWhereInput = {
    AND?: BundleItemWhereInput | BundleItemWhereInput[]
    OR?: BundleItemWhereInput[]
    NOT?: BundleItemWhereInput | BundleItemWhereInput[]
    id?: StringFilter<"BundleItem"> | string
    bundleId?: StringFilter<"BundleItem"> | string
    eventType?: StringFilter<"BundleItem"> | string
    templateName?: StringFilter<"BundleItem"> | string
    templateFile?: StringFilter<"BundleItem"> | string
    createdAt?: DateTimeFilter<"BundleItem"> | Date | string
    updatedAt?: DateTimeFilter<"BundleItem"> | Date | string
    bundle?: XOR<BundleRelationFilter, BundleWhereInput>
  }

  export type BundleItemOrderByWithRelationInput = {
    id?: SortOrder
    bundleId?: SortOrder
    eventType?: SortOrder
    templateName?: SortOrder
    templateFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bundle?: BundleOrderByWithRelationInput
  }

  export type BundleItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BundleItemWhereInput | BundleItemWhereInput[]
    OR?: BundleItemWhereInput[]
    NOT?: BundleItemWhereInput | BundleItemWhereInput[]
    bundleId?: StringFilter<"BundleItem"> | string
    eventType?: StringFilter<"BundleItem"> | string
    templateName?: StringFilter<"BundleItem"> | string
    templateFile?: StringFilter<"BundleItem"> | string
    createdAt?: DateTimeFilter<"BundleItem"> | Date | string
    updatedAt?: DateTimeFilter<"BundleItem"> | Date | string
    bundle?: XOR<BundleRelationFilter, BundleWhereInput>
  }, "id">

  export type BundleItemOrderByWithAggregationInput = {
    id?: SortOrder
    bundleId?: SortOrder
    eventType?: SortOrder
    templateName?: SortOrder
    templateFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BundleItemCountOrderByAggregateInput
    _max?: BundleItemMaxOrderByAggregateInput
    _min?: BundleItemMinOrderByAggregateInput
  }

  export type BundleItemScalarWhereWithAggregatesInput = {
    AND?: BundleItemScalarWhereWithAggregatesInput | BundleItemScalarWhereWithAggregatesInput[]
    OR?: BundleItemScalarWhereWithAggregatesInput[]
    NOT?: BundleItemScalarWhereWithAggregatesInput | BundleItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BundleItem"> | string
    bundleId?: StringWithAggregatesFilter<"BundleItem"> | string
    eventType?: StringWithAggregatesFilter<"BundleItem"> | string
    templateName?: StringWithAggregatesFilter<"BundleItem"> | string
    templateFile?: StringWithAggregatesFilter<"BundleItem"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BundleItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BundleItem"> | Date | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    userId?: StringFilter<"Order"> | string
    bundleId?: StringFilter<"Order"> | string
    totalAmount?: FloatFilter<"Order"> | number
    status?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    bundle?: XOR<BundleRelationFilter, BundleWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    bundleId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bundle?: BundleOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    userId?: StringFilter<"Order"> | string
    bundleId?: StringFilter<"Order"> | string
    totalAmount?: FloatFilter<"Order"> | number
    status?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    bundle?: XOR<BundleRelationFilter, BundleWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    bundleId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    userId?: StringWithAggregatesFilter<"Order"> | string
    bundleId?: StringWithAggregatesFilter<"Order"> | string
    totalAmount?: FloatWithAggregatesFilter<"Order"> | number
    status?: StringWithAggregatesFilter<"Order"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
  }

  export type ThemeWhereInput = {
    AND?: ThemeWhereInput | ThemeWhereInput[]
    OR?: ThemeWhereInput[]
    NOT?: ThemeWhereInput | ThemeWhereInput[]
    id?: StringFilter<"Theme"> | string
    name?: StringFilter<"Theme"> | string
    description?: StringNullableFilter<"Theme"> | string | null
    thumbnailUrl?: StringNullableFilter<"Theme"> | string | null
    previewImages?: StringNullableFilter<"Theme"> | string | null
    isActive?: BoolFilter<"Theme"> | boolean
    createdAt?: DateTimeFilter<"Theme"> | Date | string
    updatedAt?: DateTimeFilter<"Theme"> | Date | string
    isBestSeller?: BoolFilter<"Theme"> | boolean
    isPopular?: BoolFilter<"Theme"> | boolean
    bundles?: BundleListRelationFilter
    weddings?: WeddingListRelationFilter
  }

  export type ThemeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    previewImages?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isBestSeller?: SortOrder
    isPopular?: SortOrder
    bundles?: BundleOrderByRelationAggregateInput
    weddings?: WeddingOrderByRelationAggregateInput
  }

  export type ThemeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ThemeWhereInput | ThemeWhereInput[]
    OR?: ThemeWhereInput[]
    NOT?: ThemeWhereInput | ThemeWhereInput[]
    name?: StringFilter<"Theme"> | string
    description?: StringNullableFilter<"Theme"> | string | null
    thumbnailUrl?: StringNullableFilter<"Theme"> | string | null
    previewImages?: StringNullableFilter<"Theme"> | string | null
    isActive?: BoolFilter<"Theme"> | boolean
    createdAt?: DateTimeFilter<"Theme"> | Date | string
    updatedAt?: DateTimeFilter<"Theme"> | Date | string
    isBestSeller?: BoolFilter<"Theme"> | boolean
    isPopular?: BoolFilter<"Theme"> | boolean
    bundles?: BundleListRelationFilter
    weddings?: WeddingListRelationFilter
  }, "id">

  export type ThemeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    previewImages?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isBestSeller?: SortOrder
    isPopular?: SortOrder
    _count?: ThemeCountOrderByAggregateInput
    _max?: ThemeMaxOrderByAggregateInput
    _min?: ThemeMinOrderByAggregateInput
  }

  export type ThemeScalarWhereWithAggregatesInput = {
    AND?: ThemeScalarWhereWithAggregatesInput | ThemeScalarWhereWithAggregatesInput[]
    OR?: ThemeScalarWhereWithAggregatesInput[]
    NOT?: ThemeScalarWhereWithAggregatesInput | ThemeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Theme"> | string
    name?: StringWithAggregatesFilter<"Theme"> | string
    description?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    thumbnailUrl?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    previewImages?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    isActive?: BoolWithAggregatesFilter<"Theme"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Theme"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Theme"> | Date | string
    isBestSeller?: BoolWithAggregatesFilter<"Theme"> | boolean
    isPopular?: BoolWithAggregatesFilter<"Theme"> | boolean
  }

  export type WeddingWhereInput = {
    AND?: WeddingWhereInput | WeddingWhereInput[]
    OR?: WeddingWhereInput[]
    NOT?: WeddingWhereInput | WeddingWhereInput[]
    id?: StringFilter<"Wedding"> | string
    ownerId?: StringFilter<"Wedding"> | string
    themeId?: StringFilter<"Wedding"> | string
    groomName?: StringFilter<"Wedding"> | string
    brideName?: StringFilter<"Wedding"> | string
    groomParents?: StringNullableFilter<"Wedding"> | string | null
    brideParents?: StringNullableFilter<"Wedding"> | string | null
    rsvpContact?: StringNullableFilter<"Wedding"> | string | null
    rsvpDeadline?: DateTimeNullableFilter<"Wedding"> | Date | string | null
    invitationMessage?: StringNullableFilter<"Wedding"> | string | null
    createdAt?: DateTimeFilter<"Wedding"> | Date | string
    updatedAt?: DateTimeFilter<"Wedding"> | Date | string
    events?: EventListRelationFilter
    rsvps?: RSVPListRelationFilter
    owner?: XOR<UserRelationFilter, UserWhereInput>
    theme?: XOR<ThemeRelationFilter, ThemeWhereInput>
  }

  export type WeddingOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    themeId?: SortOrder
    groomName?: SortOrder
    brideName?: SortOrder
    groomParents?: SortOrderInput | SortOrder
    brideParents?: SortOrderInput | SortOrder
    rsvpContact?: SortOrderInput | SortOrder
    rsvpDeadline?: SortOrderInput | SortOrder
    invitationMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    events?: EventOrderByRelationAggregateInput
    rsvps?: RSVPOrderByRelationAggregateInput
    owner?: UserOrderByWithRelationInput
    theme?: ThemeOrderByWithRelationInput
  }

  export type WeddingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WeddingWhereInput | WeddingWhereInput[]
    OR?: WeddingWhereInput[]
    NOT?: WeddingWhereInput | WeddingWhereInput[]
    ownerId?: StringFilter<"Wedding"> | string
    themeId?: StringFilter<"Wedding"> | string
    groomName?: StringFilter<"Wedding"> | string
    brideName?: StringFilter<"Wedding"> | string
    groomParents?: StringNullableFilter<"Wedding"> | string | null
    brideParents?: StringNullableFilter<"Wedding"> | string | null
    rsvpContact?: StringNullableFilter<"Wedding"> | string | null
    rsvpDeadline?: DateTimeNullableFilter<"Wedding"> | Date | string | null
    invitationMessage?: StringNullableFilter<"Wedding"> | string | null
    createdAt?: DateTimeFilter<"Wedding"> | Date | string
    updatedAt?: DateTimeFilter<"Wedding"> | Date | string
    events?: EventListRelationFilter
    rsvps?: RSVPListRelationFilter
    owner?: XOR<UserRelationFilter, UserWhereInput>
    theme?: XOR<ThemeRelationFilter, ThemeWhereInput>
  }, "id">

  export type WeddingOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    themeId?: SortOrder
    groomName?: SortOrder
    brideName?: SortOrder
    groomParents?: SortOrderInput | SortOrder
    brideParents?: SortOrderInput | SortOrder
    rsvpContact?: SortOrderInput | SortOrder
    rsvpDeadline?: SortOrderInput | SortOrder
    invitationMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WeddingCountOrderByAggregateInput
    _max?: WeddingMaxOrderByAggregateInput
    _min?: WeddingMinOrderByAggregateInput
  }

  export type WeddingScalarWhereWithAggregatesInput = {
    AND?: WeddingScalarWhereWithAggregatesInput | WeddingScalarWhereWithAggregatesInput[]
    OR?: WeddingScalarWhereWithAggregatesInput[]
    NOT?: WeddingScalarWhereWithAggregatesInput | WeddingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Wedding"> | string
    ownerId?: StringWithAggregatesFilter<"Wedding"> | string
    themeId?: StringWithAggregatesFilter<"Wedding"> | string
    groomName?: StringWithAggregatesFilter<"Wedding"> | string
    brideName?: StringWithAggregatesFilter<"Wedding"> | string
    groomParents?: StringNullableWithAggregatesFilter<"Wedding"> | string | null
    brideParents?: StringNullableWithAggregatesFilter<"Wedding"> | string | null
    rsvpContact?: StringNullableWithAggregatesFilter<"Wedding"> | string | null
    rsvpDeadline?: DateTimeNullableWithAggregatesFilter<"Wedding"> | Date | string | null
    invitationMessage?: StringNullableWithAggregatesFilter<"Wedding"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Wedding"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Wedding"> | Date | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: StringFilter<"Event"> | string
    weddingId?: StringFilter<"Event"> | string
    name?: StringFilter<"Event"> | string
    date?: StringFilter<"Event"> | string
    time?: StringFilter<"Event"> | string
    venue?: StringFilter<"Event"> | string
    mapLink?: StringNullableFilter<"Event"> | string | null
    description?: StringNullableFilter<"Event"> | string | null
    eventType?: StringNullableFilter<"Event"> | string | null
    rsvpDeadline?: StringNullableFilter<"Event"> | string | null
    allowCompanions?: BoolFilter<"Event"> | boolean
    collectDietary?: BoolFilter<"Event"> | boolean
    maxGuests?: IntFilter<"Event"> | number
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    wedding?: XOR<WeddingRelationFilter, WeddingWhereInput>
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    date?: SortOrder
    time?: SortOrder
    venue?: SortOrder
    mapLink?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    eventType?: SortOrderInput | SortOrder
    rsvpDeadline?: SortOrderInput | SortOrder
    allowCompanions?: SortOrder
    collectDietary?: SortOrder
    maxGuests?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    weddingId?: StringFilter<"Event"> | string
    name?: StringFilter<"Event"> | string
    date?: StringFilter<"Event"> | string
    time?: StringFilter<"Event"> | string
    venue?: StringFilter<"Event"> | string
    mapLink?: StringNullableFilter<"Event"> | string | null
    description?: StringNullableFilter<"Event"> | string | null
    eventType?: StringNullableFilter<"Event"> | string | null
    rsvpDeadline?: StringNullableFilter<"Event"> | string | null
    allowCompanions?: BoolFilter<"Event"> | boolean
    collectDietary?: BoolFilter<"Event"> | boolean
    maxGuests?: IntFilter<"Event"> | number
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    wedding?: XOR<WeddingRelationFilter, WeddingWhereInput>
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    date?: SortOrder
    time?: SortOrder
    venue?: SortOrder
    mapLink?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    eventType?: SortOrderInput | SortOrder
    rsvpDeadline?: SortOrderInput | SortOrder
    allowCompanions?: SortOrder
    collectDietary?: SortOrder
    maxGuests?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Event"> | string
    weddingId?: StringWithAggregatesFilter<"Event"> | string
    name?: StringWithAggregatesFilter<"Event"> | string
    date?: StringWithAggregatesFilter<"Event"> | string
    time?: StringWithAggregatesFilter<"Event"> | string
    venue?: StringWithAggregatesFilter<"Event"> | string
    mapLink?: StringNullableWithAggregatesFilter<"Event"> | string | null
    description?: StringNullableWithAggregatesFilter<"Event"> | string | null
    eventType?: StringNullableWithAggregatesFilter<"Event"> | string | null
    rsvpDeadline?: StringNullableWithAggregatesFilter<"Event"> | string | null
    allowCompanions?: BoolWithAggregatesFilter<"Event"> | boolean
    collectDietary?: BoolWithAggregatesFilter<"Event"> | boolean
    maxGuests?: IntWithAggregatesFilter<"Event"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
  }

  export type RSVPWhereInput = {
    AND?: RSVPWhereInput | RSVPWhereInput[]
    OR?: RSVPWhereInput[]
    NOT?: RSVPWhereInput | RSVPWhereInput[]
    id?: StringFilter<"RSVP"> | string
    weddingId?: StringFilter<"RSVP"> | string
    guestName?: StringFilter<"RSVP"> | string
    phone?: StringNullableFilter<"RSVP"> | string | null
    adultCount?: IntFilter<"RSVP"> | number
    childCount?: IntFilter<"RSVP"> | number
    attending?: BoolFilter<"RSVP"> | boolean
    status?: StringFilter<"RSVP"> | string
    dietary?: StringNullableFilter<"RSVP"> | string | null
    message?: StringNullableFilter<"RSVP"> | string | null
    createdAt?: DateTimeFilter<"RSVP"> | Date | string
    updatedAt?: DateTimeFilter<"RSVP"> | Date | string
    wedding?: XOR<WeddingRelationFilter, WeddingWhereInput>
  }

  export type RSVPOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    guestName?: SortOrder
    phone?: SortOrderInput | SortOrder
    adultCount?: SortOrder
    childCount?: SortOrder
    attending?: SortOrder
    status?: SortOrder
    dietary?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
  }

  export type RSVPWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RSVPWhereInput | RSVPWhereInput[]
    OR?: RSVPWhereInput[]
    NOT?: RSVPWhereInput | RSVPWhereInput[]
    weddingId?: StringFilter<"RSVP"> | string
    guestName?: StringFilter<"RSVP"> | string
    phone?: StringNullableFilter<"RSVP"> | string | null
    adultCount?: IntFilter<"RSVP"> | number
    childCount?: IntFilter<"RSVP"> | number
    attending?: BoolFilter<"RSVP"> | boolean
    status?: StringFilter<"RSVP"> | string
    dietary?: StringNullableFilter<"RSVP"> | string | null
    message?: StringNullableFilter<"RSVP"> | string | null
    createdAt?: DateTimeFilter<"RSVP"> | Date | string
    updatedAt?: DateTimeFilter<"RSVP"> | Date | string
    wedding?: XOR<WeddingRelationFilter, WeddingWhereInput>
  }, "id">

  export type RSVPOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    guestName?: SortOrder
    phone?: SortOrderInput | SortOrder
    adultCount?: SortOrder
    childCount?: SortOrder
    attending?: SortOrder
    status?: SortOrder
    dietary?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RSVPCountOrderByAggregateInput
    _avg?: RSVPAvgOrderByAggregateInput
    _max?: RSVPMaxOrderByAggregateInput
    _min?: RSVPMinOrderByAggregateInput
    _sum?: RSVPSumOrderByAggregateInput
  }

  export type RSVPScalarWhereWithAggregatesInput = {
    AND?: RSVPScalarWhereWithAggregatesInput | RSVPScalarWhereWithAggregatesInput[]
    OR?: RSVPScalarWhereWithAggregatesInput[]
    NOT?: RSVPScalarWhereWithAggregatesInput | RSVPScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RSVP"> | string
    weddingId?: StringWithAggregatesFilter<"RSVP"> | string
    guestName?: StringWithAggregatesFilter<"RSVP"> | string
    phone?: StringNullableWithAggregatesFilter<"RSVP"> | string | null
    adultCount?: IntWithAggregatesFilter<"RSVP"> | number
    childCount?: IntWithAggregatesFilter<"RSVP"> | number
    attending?: BoolWithAggregatesFilter<"RSVP"> | boolean
    status?: StringWithAggregatesFilter<"RSVP"> | string
    dietary?: StringNullableWithAggregatesFilter<"RSVP"> | string | null
    message?: StringNullableWithAggregatesFilter<"RSVP"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RSVP"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RSVP"> | Date | string
  }

  export type PackageWhereInput = {
    AND?: PackageWhereInput | PackageWhereInput[]
    OR?: PackageWhereInput[]
    NOT?: PackageWhereInput | PackageWhereInput[]
    id?: StringFilter<"Package"> | string
    name?: StringFilter<"Package"> | string
    price?: IntFilter<"Package"> | number
    level?: IntFilter<"Package"> | number
    allowedItems?: StringFilter<"Package"> | string
    isActive?: BoolFilter<"Package"> | boolean
    whatYouGet?: StringNullableFilter<"Package"> | string | null
    productHighlights?: StringNullableFilter<"Package"> | string | null
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
  }

  export type PackageOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    level?: SortOrder
    allowedItems?: SortOrder
    isActive?: SortOrder
    whatYouGet?: SortOrderInput | SortOrder
    productHighlights?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PackageWhereInput | PackageWhereInput[]
    OR?: PackageWhereInput[]
    NOT?: PackageWhereInput | PackageWhereInput[]
    name?: StringFilter<"Package"> | string
    price?: IntFilter<"Package"> | number
    level?: IntFilter<"Package"> | number
    allowedItems?: StringFilter<"Package"> | string
    isActive?: BoolFilter<"Package"> | boolean
    whatYouGet?: StringNullableFilter<"Package"> | string | null
    productHighlights?: StringNullableFilter<"Package"> | string | null
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
  }, "id">

  export type PackageOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    level?: SortOrder
    allowedItems?: SortOrder
    isActive?: SortOrder
    whatYouGet?: SortOrderInput | SortOrder
    productHighlights?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PackageCountOrderByAggregateInput
    _avg?: PackageAvgOrderByAggregateInput
    _max?: PackageMaxOrderByAggregateInput
    _min?: PackageMinOrderByAggregateInput
    _sum?: PackageSumOrderByAggregateInput
  }

  export type PackageScalarWhereWithAggregatesInput = {
    AND?: PackageScalarWhereWithAggregatesInput | PackageScalarWhereWithAggregatesInput[]
    OR?: PackageScalarWhereWithAggregatesInput[]
    NOT?: PackageScalarWhereWithAggregatesInput | PackageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Package"> | string
    name?: StringWithAggregatesFilter<"Package"> | string
    price?: IntWithAggregatesFilter<"Package"> | number
    level?: IntWithAggregatesFilter<"Package"> | number
    allowedItems?: StringWithAggregatesFilter<"Package"> | string
    isActive?: BoolWithAggregatesFilter<"Package"> | boolean
    whatYouGet?: StringNullableWithAggregatesFilter<"Package"> | string | null
    productHighlights?: StringNullableWithAggregatesFilter<"Package"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isMobileVerified?: boolean
    mobileNumber: string
    role?: string
    status?: string
    orders?: OrderCreateNestedManyWithoutUserInput
    weddings?: WeddingCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isMobileVerified?: boolean
    mobileNumber: string
    role?: string
    status?: string
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    weddings?: WeddingUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isMobileVerified?: BoolFieldUpdateOperationsInput | boolean
    mobileNumber?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    orders?: OrderUpdateManyWithoutUserNestedInput
    weddings?: WeddingUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isMobileVerified?: BoolFieldUpdateOperationsInput | boolean
    mobileNumber?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    weddings?: WeddingUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isMobileVerified?: boolean
    mobileNumber: string
    role?: string
    status?: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isMobileVerified?: BoolFieldUpdateOperationsInput | boolean
    mobileNumber?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isMobileVerified?: BoolFieldUpdateOperationsInput | boolean
    mobileNumber?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type OTPRequestCreateInput = {
    id?: string
    mobileNumber: string
    otpHash: string
    expiresAt: Date | string
    isUsed?: boolean
    attemptCount?: number
    createdAt?: Date | string
  }

  export type OTPRequestUncheckedCreateInput = {
    id?: string
    mobileNumber: string
    otpHash: string
    expiresAt: Date | string
    isUsed?: boolean
    attemptCount?: number
    createdAt?: Date | string
  }

  export type OTPRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    otpHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    attemptCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    otpHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    attemptCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPRequestCreateManyInput = {
    id?: string
    mobileNumber: string
    otpHash: string
    expiresAt: Date | string
    isUsed?: boolean
    attemptCount?: number
    createdAt?: Date | string
  }

  export type OTPRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    otpHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    attemptCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    otpHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    attemptCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleCreateInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
    themeRef?: ThemeCreateNestedOneWithoutBundlesInput
    orders?: OrderCreateNestedManyWithoutBundleInput
    bundleItems?: BundleItemCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    themeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
    orders?: OrderUncheckedCreateNestedManyWithoutBundleInput
    bundleItems?: BundleItemUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
    themeRef?: ThemeUpdateOneWithoutBundlesNestedInput
    orders?: OrderUpdateManyWithoutBundleNestedInput
    bundleItems?: BundleItemUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: OrderUncheckedUpdateManyWithoutBundleNestedInput
    bundleItems?: BundleItemUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type BundleCreateManyInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    themeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
  }

  export type BundleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BundleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BundleItemCreateInput = {
    id?: string
    eventType: string
    templateName: string
    templateFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bundle: BundleCreateNestedOneWithoutBundleItemsInput
  }

  export type BundleItemUncheckedCreateInput = {
    id?: string
    bundleId: string
    eventType: string
    templateName: string
    templateFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BundleItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    templateName?: StringFieldUpdateOperationsInput | string
    templateFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateOneRequiredWithoutBundleItemsNestedInput
  }

  export type BundleItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bundleId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    templateName?: StringFieldUpdateOperationsInput | string
    templateFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleItemCreateManyInput = {
    id?: string
    bundleId: string
    eventType: string
    templateName: string
    templateFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BundleItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    templateName?: StringFieldUpdateOperationsInput | string
    templateFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bundleId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    templateName?: StringFieldUpdateOperationsInput | string
    templateFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bundle: BundleCreateNestedOneWithoutOrdersInput
    user: UserCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    userId: string
    bundleId: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateOneRequiredWithoutOrdersNestedInput
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bundleId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateManyInput = {
    id?: string
    userId: string
    bundleId: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bundleId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemeCreateInput = {
    id?: string
    name: string
    description?: string | null
    thumbnailUrl?: string | null
    previewImages?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    isBestSeller?: boolean
    isPopular?: boolean
    bundles?: BundleCreateNestedManyWithoutThemeRefInput
    weddings?: WeddingCreateNestedManyWithoutThemeInput
  }

  export type ThemeUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    thumbnailUrl?: string | null
    previewImages?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    isBestSeller?: boolean
    isPopular?: boolean
    bundles?: BundleUncheckedCreateNestedManyWithoutThemeRefInput
    weddings?: WeddingUncheckedCreateNestedManyWithoutThemeInput
  }

  export type ThemeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isBestSeller?: BoolFieldUpdateOperationsInput | boolean
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    bundles?: BundleUpdateManyWithoutThemeRefNestedInput
    weddings?: WeddingUpdateManyWithoutThemeNestedInput
  }

  export type ThemeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isBestSeller?: BoolFieldUpdateOperationsInput | boolean
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    bundles?: BundleUncheckedUpdateManyWithoutThemeRefNestedInput
    weddings?: WeddingUncheckedUpdateManyWithoutThemeNestedInput
  }

  export type ThemeCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    thumbnailUrl?: string | null
    previewImages?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    isBestSeller?: boolean
    isPopular?: boolean
  }

  export type ThemeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isBestSeller?: BoolFieldUpdateOperationsInput | boolean
    isPopular?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ThemeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isBestSeller?: BoolFieldUpdateOperationsInput | boolean
    isPopular?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WeddingCreateInput = {
    id?: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutWeddingInput
    rsvps?: RSVPCreateNestedManyWithoutWeddingInput
    owner: UserCreateNestedOneWithoutWeddingsInput
    theme: ThemeCreateNestedOneWithoutWeddingsInput
  }

  export type WeddingUncheckedCreateInput = {
    id?: string
    ownerId: string
    themeId: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutWeddingInput
    rsvps?: RSVPUncheckedCreateNestedManyWithoutWeddingInput
  }

  export type WeddingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutWeddingNestedInput
    rsvps?: RSVPUpdateManyWithoutWeddingNestedInput
    owner?: UserUpdateOneRequiredWithoutWeddingsNestedInput
    theme?: ThemeUpdateOneRequiredWithoutWeddingsNestedInput
  }

  export type WeddingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutWeddingNestedInput
    rsvps?: RSVPUncheckedUpdateManyWithoutWeddingNestedInput
  }

  export type WeddingCreateManyInput = {
    id?: string
    ownerId: string
    themeId: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateInput = {
    id?: string
    name: string
    date: string
    time: string
    venue: string
    mapLink?: string | null
    description?: string | null
    eventType?: string | null
    rsvpDeadline?: string | null
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutEventsInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    weddingId: string
    name: string
    date: string
    time: string
    venue: string
    mapLink?: string | null
    description?: string | null
    eventType?: string | null
    rsvpDeadline?: string | null
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    mapLink?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableStringFieldUpdateOperationsInput | string | null
    allowCompanions?: BoolFieldUpdateOperationsInput | boolean
    collectDietary?: BoolFieldUpdateOperationsInput | boolean
    maxGuests?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    mapLink?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableStringFieldUpdateOperationsInput | string | null
    allowCompanions?: BoolFieldUpdateOperationsInput | boolean
    collectDietary?: BoolFieldUpdateOperationsInput | boolean
    maxGuests?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateManyInput = {
    id?: string
    weddingId: string
    name: string
    date: string
    time: string
    venue: string
    mapLink?: string | null
    description?: string | null
    eventType?: string | null
    rsvpDeadline?: string | null
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    mapLink?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableStringFieldUpdateOperationsInput | string | null
    allowCompanions?: BoolFieldUpdateOperationsInput | boolean
    collectDietary?: BoolFieldUpdateOperationsInput | boolean
    maxGuests?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    mapLink?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableStringFieldUpdateOperationsInput | string | null
    allowCompanions?: BoolFieldUpdateOperationsInput | boolean
    collectDietary?: BoolFieldUpdateOperationsInput | boolean
    maxGuests?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RSVPCreateInput = {
    id?: string
    guestName: string
    phone?: string | null
    adultCount?: number
    childCount?: number
    attending?: boolean
    status?: string
    dietary?: string | null
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutRsvpsInput
  }

  export type RSVPUncheckedCreateInput = {
    id?: string
    weddingId: string
    guestName: string
    phone?: string | null
    adultCount?: number
    childCount?: number
    attending?: boolean
    status?: string
    dietary?: string | null
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RSVPUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    adultCount?: IntFieldUpdateOperationsInput | number
    childCount?: IntFieldUpdateOperationsInput | number
    attending?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    dietary?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutRsvpsNestedInput
  }

  export type RSVPUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    guestName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    adultCount?: IntFieldUpdateOperationsInput | number
    childCount?: IntFieldUpdateOperationsInput | number
    attending?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    dietary?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RSVPCreateManyInput = {
    id?: string
    weddingId: string
    guestName: string
    phone?: string | null
    adultCount?: number
    childCount?: number
    attending?: boolean
    status?: string
    dietary?: string | null
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RSVPUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    adultCount?: IntFieldUpdateOperationsInput | number
    childCount?: IntFieldUpdateOperationsInput | number
    attending?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    dietary?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RSVPUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    guestName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    adultCount?: IntFieldUpdateOperationsInput | number
    childCount?: IntFieldUpdateOperationsInput | number
    attending?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    dietary?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageCreateInput = {
    id?: string
    name: string
    price: number
    level: number
    allowedItems: string
    isActive?: boolean
    whatYouGet?: string | null
    productHighlights?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageUncheckedCreateInput = {
    id?: string
    name: string
    price: number
    level: number
    allowedItems: string
    isActive?: boolean
    whatYouGet?: string | null
    productHighlights?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    allowedItems?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    whatYouGet?: NullableStringFieldUpdateOperationsInput | string | null
    productHighlights?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    allowedItems?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    whatYouGet?: NullableStringFieldUpdateOperationsInput | string | null
    productHighlights?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageCreateManyInput = {
    id?: string
    name: string
    price: number
    level: number
    allowedItems: string
    isActive?: boolean
    whatYouGet?: string | null
    productHighlights?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    allowedItems?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    whatYouGet?: NullableStringFieldUpdateOperationsInput | string | null
    productHighlights?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    allowedItems?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    whatYouGet?: NullableStringFieldUpdateOperationsInput | string | null
    productHighlights?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type WeddingListRelationFilter = {
    every?: WeddingWhereInput
    some?: WeddingWhereInput
    none?: WeddingWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WeddingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isMobileVerified?: SortOrder
    mobileNumber?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isMobileVerified?: SortOrder
    mobileNumber?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isMobileVerified?: SortOrder
    mobileNumber?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type OTPRequestCountOrderByAggregateInput = {
    id?: SortOrder
    mobileNumber?: SortOrder
    otpHash?: SortOrder
    expiresAt?: SortOrder
    isUsed?: SortOrder
    attemptCount?: SortOrder
    createdAt?: SortOrder
  }

  export type OTPRequestAvgOrderByAggregateInput = {
    attemptCount?: SortOrder
  }

  export type OTPRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    mobileNumber?: SortOrder
    otpHash?: SortOrder
    expiresAt?: SortOrder
    isUsed?: SortOrder
    attemptCount?: SortOrder
    createdAt?: SortOrder
  }

  export type OTPRequestMinOrderByAggregateInput = {
    id?: SortOrder
    mobileNumber?: SortOrder
    otpHash?: SortOrder
    expiresAt?: SortOrder
    isUsed?: SortOrder
    attemptCount?: SortOrder
    createdAt?: SortOrder
  }

  export type OTPRequestSumOrderByAggregateInput = {
    attemptCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ThemeNullableRelationFilter = {
    is?: ThemeWhereInput | null
    isNot?: ThemeWhereInput | null
  }

  export type BundleItemListRelationFilter = {
    every?: BundleItemWhereInput
    some?: BundleItemWhereInput
    none?: BundleItemWhereInput
  }

  export type BundleItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BundleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    whatsappPrice?: SortOrder
    printablePrice?: SortOrder
    completePrice?: SortOrder
    isPopular?: SortOrder
    theme?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    themeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    previewImages?: SortOrder
    thumbnailUrl?: SortOrder
    itemImages?: SortOrder
  }

  export type BundleAvgOrderByAggregateInput = {
    whatsappPrice?: SortOrder
    printablePrice?: SortOrder
    completePrice?: SortOrder
  }

  export type BundleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    whatsappPrice?: SortOrder
    printablePrice?: SortOrder
    completePrice?: SortOrder
    isPopular?: SortOrder
    theme?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    themeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    previewImages?: SortOrder
    thumbnailUrl?: SortOrder
    itemImages?: SortOrder
  }

  export type BundleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    whatsappPrice?: SortOrder
    printablePrice?: SortOrder
    completePrice?: SortOrder
    isPopular?: SortOrder
    theme?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    themeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    previewImages?: SortOrder
    thumbnailUrl?: SortOrder
    itemImages?: SortOrder
  }

  export type BundleSumOrderByAggregateInput = {
    whatsappPrice?: SortOrder
    printablePrice?: SortOrder
    completePrice?: SortOrder
  }

  export type BundleRelationFilter = {
    is?: BundleWhereInput
    isNot?: BundleWhereInput
  }

  export type BundleItemCountOrderByAggregateInput = {
    id?: SortOrder
    bundleId?: SortOrder
    eventType?: SortOrder
    templateName?: SortOrder
    templateFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BundleItemMaxOrderByAggregateInput = {
    id?: SortOrder
    bundleId?: SortOrder
    eventType?: SortOrder
    templateName?: SortOrder
    templateFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BundleItemMinOrderByAggregateInput = {
    id?: SortOrder
    bundleId?: SortOrder
    eventType?: SortOrder
    templateName?: SortOrder
    templateFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    bundleId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    bundleId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    bundleId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BundleListRelationFilter = {
    every?: BundleWhereInput
    some?: BundleWhereInput
    none?: BundleWhereInput
  }

  export type BundleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ThemeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    thumbnailUrl?: SortOrder
    previewImages?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isBestSeller?: SortOrder
    isPopular?: SortOrder
  }

  export type ThemeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    thumbnailUrl?: SortOrder
    previewImages?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isBestSeller?: SortOrder
    isPopular?: SortOrder
  }

  export type ThemeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    thumbnailUrl?: SortOrder
    previewImages?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isBestSeller?: SortOrder
    isPopular?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EventListRelationFilter = {
    every?: EventWhereInput
    some?: EventWhereInput
    none?: EventWhereInput
  }

  export type RSVPListRelationFilter = {
    every?: RSVPWhereInput
    some?: RSVPWhereInput
    none?: RSVPWhereInput
  }

  export type ThemeRelationFilter = {
    is?: ThemeWhereInput
    isNot?: ThemeWhereInput
  }

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RSVPOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WeddingCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    themeId?: SortOrder
    groomName?: SortOrder
    brideName?: SortOrder
    groomParents?: SortOrder
    brideParents?: SortOrder
    rsvpContact?: SortOrder
    rsvpDeadline?: SortOrder
    invitationMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WeddingMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    themeId?: SortOrder
    groomName?: SortOrder
    brideName?: SortOrder
    groomParents?: SortOrder
    brideParents?: SortOrder
    rsvpContact?: SortOrder
    rsvpDeadline?: SortOrder
    invitationMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WeddingMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    themeId?: SortOrder
    groomName?: SortOrder
    brideName?: SortOrder
    groomParents?: SortOrder
    brideParents?: SortOrder
    rsvpContact?: SortOrder
    rsvpDeadline?: SortOrder
    invitationMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type WeddingRelationFilter = {
    is?: WeddingWhereInput
    isNot?: WeddingWhereInput
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    date?: SortOrder
    time?: SortOrder
    venue?: SortOrder
    mapLink?: SortOrder
    description?: SortOrder
    eventType?: SortOrder
    rsvpDeadline?: SortOrder
    allowCompanions?: SortOrder
    collectDietary?: SortOrder
    maxGuests?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    maxGuests?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    date?: SortOrder
    time?: SortOrder
    venue?: SortOrder
    mapLink?: SortOrder
    description?: SortOrder
    eventType?: SortOrder
    rsvpDeadline?: SortOrder
    allowCompanions?: SortOrder
    collectDietary?: SortOrder
    maxGuests?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    date?: SortOrder
    time?: SortOrder
    venue?: SortOrder
    mapLink?: SortOrder
    description?: SortOrder
    eventType?: SortOrder
    rsvpDeadline?: SortOrder
    allowCompanions?: SortOrder
    collectDietary?: SortOrder
    maxGuests?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    maxGuests?: SortOrder
  }

  export type RSVPCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    guestName?: SortOrder
    phone?: SortOrder
    adultCount?: SortOrder
    childCount?: SortOrder
    attending?: SortOrder
    status?: SortOrder
    dietary?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RSVPAvgOrderByAggregateInput = {
    adultCount?: SortOrder
    childCount?: SortOrder
  }

  export type RSVPMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    guestName?: SortOrder
    phone?: SortOrder
    adultCount?: SortOrder
    childCount?: SortOrder
    attending?: SortOrder
    status?: SortOrder
    dietary?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RSVPMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    guestName?: SortOrder
    phone?: SortOrder
    adultCount?: SortOrder
    childCount?: SortOrder
    attending?: SortOrder
    status?: SortOrder
    dietary?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RSVPSumOrderByAggregateInput = {
    adultCount?: SortOrder
    childCount?: SortOrder
  }

  export type PackageCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    level?: SortOrder
    allowedItems?: SortOrder
    isActive?: SortOrder
    whatYouGet?: SortOrder
    productHighlights?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageAvgOrderByAggregateInput = {
    price?: SortOrder
    level?: SortOrder
  }

  export type PackageMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    level?: SortOrder
    allowedItems?: SortOrder
    isActive?: SortOrder
    whatYouGet?: SortOrder
    productHighlights?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    level?: SortOrder
    allowedItems?: SortOrder
    isActive?: SortOrder
    whatYouGet?: SortOrder
    productHighlights?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageSumOrderByAggregateInput = {
    price?: SortOrder
    level?: SortOrder
  }

  export type OrderCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type WeddingCreateNestedManyWithoutOwnerInput = {
    create?: XOR<WeddingCreateWithoutOwnerInput, WeddingUncheckedCreateWithoutOwnerInput> | WeddingCreateWithoutOwnerInput[] | WeddingUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WeddingCreateOrConnectWithoutOwnerInput | WeddingCreateOrConnectWithoutOwnerInput[]
    createMany?: WeddingCreateManyOwnerInputEnvelope
    connect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type WeddingUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<WeddingCreateWithoutOwnerInput, WeddingUncheckedCreateWithoutOwnerInput> | WeddingCreateWithoutOwnerInput[] | WeddingUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WeddingCreateOrConnectWithoutOwnerInput | WeddingCreateOrConnectWithoutOwnerInput[]
    createMany?: WeddingCreateManyOwnerInputEnvelope
    connect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type OrderUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type WeddingUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<WeddingCreateWithoutOwnerInput, WeddingUncheckedCreateWithoutOwnerInput> | WeddingCreateWithoutOwnerInput[] | WeddingUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WeddingCreateOrConnectWithoutOwnerInput | WeddingCreateOrConnectWithoutOwnerInput[]
    upsert?: WeddingUpsertWithWhereUniqueWithoutOwnerInput | WeddingUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: WeddingCreateManyOwnerInputEnvelope
    set?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    disconnect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    delete?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    connect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    update?: WeddingUpdateWithWhereUniqueWithoutOwnerInput | WeddingUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: WeddingUpdateManyWithWhereWithoutOwnerInput | WeddingUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: WeddingScalarWhereInput | WeddingScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type WeddingUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<WeddingCreateWithoutOwnerInput, WeddingUncheckedCreateWithoutOwnerInput> | WeddingCreateWithoutOwnerInput[] | WeddingUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WeddingCreateOrConnectWithoutOwnerInput | WeddingCreateOrConnectWithoutOwnerInput[]
    upsert?: WeddingUpsertWithWhereUniqueWithoutOwnerInput | WeddingUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: WeddingCreateManyOwnerInputEnvelope
    set?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    disconnect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    delete?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    connect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    update?: WeddingUpdateWithWhereUniqueWithoutOwnerInput | WeddingUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: WeddingUpdateManyWithWhereWithoutOwnerInput | WeddingUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: WeddingScalarWhereInput | WeddingScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ThemeCreateNestedOneWithoutBundlesInput = {
    create?: XOR<ThemeCreateWithoutBundlesInput, ThemeUncheckedCreateWithoutBundlesInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutBundlesInput
    connect?: ThemeWhereUniqueInput
  }

  export type OrderCreateNestedManyWithoutBundleInput = {
    create?: XOR<OrderCreateWithoutBundleInput, OrderUncheckedCreateWithoutBundleInput> | OrderCreateWithoutBundleInput[] | OrderUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutBundleInput | OrderCreateOrConnectWithoutBundleInput[]
    createMany?: OrderCreateManyBundleInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type BundleItemCreateNestedManyWithoutBundleInput = {
    create?: XOR<BundleItemCreateWithoutBundleInput, BundleItemUncheckedCreateWithoutBundleInput> | BundleItemCreateWithoutBundleInput[] | BundleItemUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: BundleItemCreateOrConnectWithoutBundleInput | BundleItemCreateOrConnectWithoutBundleInput[]
    createMany?: BundleItemCreateManyBundleInputEnvelope
    connect?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutBundleInput = {
    create?: XOR<OrderCreateWithoutBundleInput, OrderUncheckedCreateWithoutBundleInput> | OrderCreateWithoutBundleInput[] | OrderUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutBundleInput | OrderCreateOrConnectWithoutBundleInput[]
    createMany?: OrderCreateManyBundleInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type BundleItemUncheckedCreateNestedManyWithoutBundleInput = {
    create?: XOR<BundleItemCreateWithoutBundleInput, BundleItemUncheckedCreateWithoutBundleInput> | BundleItemCreateWithoutBundleInput[] | BundleItemUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: BundleItemCreateOrConnectWithoutBundleInput | BundleItemCreateOrConnectWithoutBundleInput[]
    createMany?: BundleItemCreateManyBundleInputEnvelope
    connect?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
  }

  export type ThemeUpdateOneWithoutBundlesNestedInput = {
    create?: XOR<ThemeCreateWithoutBundlesInput, ThemeUncheckedCreateWithoutBundlesInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutBundlesInput
    upsert?: ThemeUpsertWithoutBundlesInput
    disconnect?: ThemeWhereInput | boolean
    delete?: ThemeWhereInput | boolean
    connect?: ThemeWhereUniqueInput
    update?: XOR<XOR<ThemeUpdateToOneWithWhereWithoutBundlesInput, ThemeUpdateWithoutBundlesInput>, ThemeUncheckedUpdateWithoutBundlesInput>
  }

  export type OrderUpdateManyWithoutBundleNestedInput = {
    create?: XOR<OrderCreateWithoutBundleInput, OrderUncheckedCreateWithoutBundleInput> | OrderCreateWithoutBundleInput[] | OrderUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutBundleInput | OrderCreateOrConnectWithoutBundleInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutBundleInput | OrderUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: OrderCreateManyBundleInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutBundleInput | OrderUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutBundleInput | OrderUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type BundleItemUpdateManyWithoutBundleNestedInput = {
    create?: XOR<BundleItemCreateWithoutBundleInput, BundleItemUncheckedCreateWithoutBundleInput> | BundleItemCreateWithoutBundleInput[] | BundleItemUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: BundleItemCreateOrConnectWithoutBundleInput | BundleItemCreateOrConnectWithoutBundleInput[]
    upsert?: BundleItemUpsertWithWhereUniqueWithoutBundleInput | BundleItemUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: BundleItemCreateManyBundleInputEnvelope
    set?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
    disconnect?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
    delete?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
    connect?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
    update?: BundleItemUpdateWithWhereUniqueWithoutBundleInput | BundleItemUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: BundleItemUpdateManyWithWhereWithoutBundleInput | BundleItemUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: BundleItemScalarWhereInput | BundleItemScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutBundleNestedInput = {
    create?: XOR<OrderCreateWithoutBundleInput, OrderUncheckedCreateWithoutBundleInput> | OrderCreateWithoutBundleInput[] | OrderUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutBundleInput | OrderCreateOrConnectWithoutBundleInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutBundleInput | OrderUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: OrderCreateManyBundleInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutBundleInput | OrderUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutBundleInput | OrderUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type BundleItemUncheckedUpdateManyWithoutBundleNestedInput = {
    create?: XOR<BundleItemCreateWithoutBundleInput, BundleItemUncheckedCreateWithoutBundleInput> | BundleItemCreateWithoutBundleInput[] | BundleItemUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: BundleItemCreateOrConnectWithoutBundleInput | BundleItemCreateOrConnectWithoutBundleInput[]
    upsert?: BundleItemUpsertWithWhereUniqueWithoutBundleInput | BundleItemUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: BundleItemCreateManyBundleInputEnvelope
    set?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
    disconnect?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
    delete?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
    connect?: BundleItemWhereUniqueInput | BundleItemWhereUniqueInput[]
    update?: BundleItemUpdateWithWhereUniqueWithoutBundleInput | BundleItemUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: BundleItemUpdateManyWithWhereWithoutBundleInput | BundleItemUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: BundleItemScalarWhereInput | BundleItemScalarWhereInput[]
  }

  export type BundleCreateNestedOneWithoutBundleItemsInput = {
    create?: XOR<BundleCreateWithoutBundleItemsInput, BundleUncheckedCreateWithoutBundleItemsInput>
    connectOrCreate?: BundleCreateOrConnectWithoutBundleItemsInput
    connect?: BundleWhereUniqueInput
  }

  export type BundleUpdateOneRequiredWithoutBundleItemsNestedInput = {
    create?: XOR<BundleCreateWithoutBundleItemsInput, BundleUncheckedCreateWithoutBundleItemsInput>
    connectOrCreate?: BundleCreateOrConnectWithoutBundleItemsInput
    upsert?: BundleUpsertWithoutBundleItemsInput
    connect?: BundleWhereUniqueInput
    update?: XOR<XOR<BundleUpdateToOneWithWhereWithoutBundleItemsInput, BundleUpdateWithoutBundleItemsInput>, BundleUncheckedUpdateWithoutBundleItemsInput>
  }

  export type BundleCreateNestedOneWithoutOrdersInput = {
    create?: XOR<BundleCreateWithoutOrdersInput, BundleUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: BundleCreateOrConnectWithoutOrdersInput
    connect?: BundleWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOrdersInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BundleUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<BundleCreateWithoutOrdersInput, BundleUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: BundleCreateOrConnectWithoutOrdersInput
    upsert?: BundleUpsertWithoutOrdersInput
    connect?: BundleWhereUniqueInput
    update?: XOR<XOR<BundleUpdateToOneWithWhereWithoutOrdersInput, BundleUpdateWithoutOrdersInput>, BundleUncheckedUpdateWithoutOrdersInput>
  }

  export type UserUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    upsert?: UserUpsertWithoutOrdersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrdersInput, UserUpdateWithoutOrdersInput>, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type BundleCreateNestedManyWithoutThemeRefInput = {
    create?: XOR<BundleCreateWithoutThemeRefInput, BundleUncheckedCreateWithoutThemeRefInput> | BundleCreateWithoutThemeRefInput[] | BundleUncheckedCreateWithoutThemeRefInput[]
    connectOrCreate?: BundleCreateOrConnectWithoutThemeRefInput | BundleCreateOrConnectWithoutThemeRefInput[]
    createMany?: BundleCreateManyThemeRefInputEnvelope
    connect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
  }

  export type WeddingCreateNestedManyWithoutThemeInput = {
    create?: XOR<WeddingCreateWithoutThemeInput, WeddingUncheckedCreateWithoutThemeInput> | WeddingCreateWithoutThemeInput[] | WeddingUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: WeddingCreateOrConnectWithoutThemeInput | WeddingCreateOrConnectWithoutThemeInput[]
    createMany?: WeddingCreateManyThemeInputEnvelope
    connect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
  }

  export type BundleUncheckedCreateNestedManyWithoutThemeRefInput = {
    create?: XOR<BundleCreateWithoutThemeRefInput, BundleUncheckedCreateWithoutThemeRefInput> | BundleCreateWithoutThemeRefInput[] | BundleUncheckedCreateWithoutThemeRefInput[]
    connectOrCreate?: BundleCreateOrConnectWithoutThemeRefInput | BundleCreateOrConnectWithoutThemeRefInput[]
    createMany?: BundleCreateManyThemeRefInputEnvelope
    connect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
  }

  export type WeddingUncheckedCreateNestedManyWithoutThemeInput = {
    create?: XOR<WeddingCreateWithoutThemeInput, WeddingUncheckedCreateWithoutThemeInput> | WeddingCreateWithoutThemeInput[] | WeddingUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: WeddingCreateOrConnectWithoutThemeInput | WeddingCreateOrConnectWithoutThemeInput[]
    createMany?: WeddingCreateManyThemeInputEnvelope
    connect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
  }

  export type BundleUpdateManyWithoutThemeRefNestedInput = {
    create?: XOR<BundleCreateWithoutThemeRefInput, BundleUncheckedCreateWithoutThemeRefInput> | BundleCreateWithoutThemeRefInput[] | BundleUncheckedCreateWithoutThemeRefInput[]
    connectOrCreate?: BundleCreateOrConnectWithoutThemeRefInput | BundleCreateOrConnectWithoutThemeRefInput[]
    upsert?: BundleUpsertWithWhereUniqueWithoutThemeRefInput | BundleUpsertWithWhereUniqueWithoutThemeRefInput[]
    createMany?: BundleCreateManyThemeRefInputEnvelope
    set?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    disconnect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    delete?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    connect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    update?: BundleUpdateWithWhereUniqueWithoutThemeRefInput | BundleUpdateWithWhereUniqueWithoutThemeRefInput[]
    updateMany?: BundleUpdateManyWithWhereWithoutThemeRefInput | BundleUpdateManyWithWhereWithoutThemeRefInput[]
    deleteMany?: BundleScalarWhereInput | BundleScalarWhereInput[]
  }

  export type WeddingUpdateManyWithoutThemeNestedInput = {
    create?: XOR<WeddingCreateWithoutThemeInput, WeddingUncheckedCreateWithoutThemeInput> | WeddingCreateWithoutThemeInput[] | WeddingUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: WeddingCreateOrConnectWithoutThemeInput | WeddingCreateOrConnectWithoutThemeInput[]
    upsert?: WeddingUpsertWithWhereUniqueWithoutThemeInput | WeddingUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: WeddingCreateManyThemeInputEnvelope
    set?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    disconnect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    delete?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    connect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    update?: WeddingUpdateWithWhereUniqueWithoutThemeInput | WeddingUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: WeddingUpdateManyWithWhereWithoutThemeInput | WeddingUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: WeddingScalarWhereInput | WeddingScalarWhereInput[]
  }

  export type BundleUncheckedUpdateManyWithoutThemeRefNestedInput = {
    create?: XOR<BundleCreateWithoutThemeRefInput, BundleUncheckedCreateWithoutThemeRefInput> | BundleCreateWithoutThemeRefInput[] | BundleUncheckedCreateWithoutThemeRefInput[]
    connectOrCreate?: BundleCreateOrConnectWithoutThemeRefInput | BundleCreateOrConnectWithoutThemeRefInput[]
    upsert?: BundleUpsertWithWhereUniqueWithoutThemeRefInput | BundleUpsertWithWhereUniqueWithoutThemeRefInput[]
    createMany?: BundleCreateManyThemeRefInputEnvelope
    set?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    disconnect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    delete?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    connect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    update?: BundleUpdateWithWhereUniqueWithoutThemeRefInput | BundleUpdateWithWhereUniqueWithoutThemeRefInput[]
    updateMany?: BundleUpdateManyWithWhereWithoutThemeRefInput | BundleUpdateManyWithWhereWithoutThemeRefInput[]
    deleteMany?: BundleScalarWhereInput | BundleScalarWhereInput[]
  }

  export type WeddingUncheckedUpdateManyWithoutThemeNestedInput = {
    create?: XOR<WeddingCreateWithoutThemeInput, WeddingUncheckedCreateWithoutThemeInput> | WeddingCreateWithoutThemeInput[] | WeddingUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: WeddingCreateOrConnectWithoutThemeInput | WeddingCreateOrConnectWithoutThemeInput[]
    upsert?: WeddingUpsertWithWhereUniqueWithoutThemeInput | WeddingUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: WeddingCreateManyThemeInputEnvelope
    set?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    disconnect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    delete?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    connect?: WeddingWhereUniqueInput | WeddingWhereUniqueInput[]
    update?: WeddingUpdateWithWhereUniqueWithoutThemeInput | WeddingUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: WeddingUpdateManyWithWhereWithoutThemeInput | WeddingUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: WeddingScalarWhereInput | WeddingScalarWhereInput[]
  }

  export type EventCreateNestedManyWithoutWeddingInput = {
    create?: XOR<EventCreateWithoutWeddingInput, EventUncheckedCreateWithoutWeddingInput> | EventCreateWithoutWeddingInput[] | EventUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: EventCreateOrConnectWithoutWeddingInput | EventCreateOrConnectWithoutWeddingInput[]
    createMany?: EventCreateManyWeddingInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type RSVPCreateNestedManyWithoutWeddingInput = {
    create?: XOR<RSVPCreateWithoutWeddingInput, RSVPUncheckedCreateWithoutWeddingInput> | RSVPCreateWithoutWeddingInput[] | RSVPUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: RSVPCreateOrConnectWithoutWeddingInput | RSVPCreateOrConnectWithoutWeddingInput[]
    createMany?: RSVPCreateManyWeddingInputEnvelope
    connect?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutWeddingsInput = {
    create?: XOR<UserCreateWithoutWeddingsInput, UserUncheckedCreateWithoutWeddingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWeddingsInput
    connect?: UserWhereUniqueInput
  }

  export type ThemeCreateNestedOneWithoutWeddingsInput = {
    create?: XOR<ThemeCreateWithoutWeddingsInput, ThemeUncheckedCreateWithoutWeddingsInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutWeddingsInput
    connect?: ThemeWhereUniqueInput
  }

  export type EventUncheckedCreateNestedManyWithoutWeddingInput = {
    create?: XOR<EventCreateWithoutWeddingInput, EventUncheckedCreateWithoutWeddingInput> | EventCreateWithoutWeddingInput[] | EventUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: EventCreateOrConnectWithoutWeddingInput | EventCreateOrConnectWithoutWeddingInput[]
    createMany?: EventCreateManyWeddingInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type RSVPUncheckedCreateNestedManyWithoutWeddingInput = {
    create?: XOR<RSVPCreateWithoutWeddingInput, RSVPUncheckedCreateWithoutWeddingInput> | RSVPCreateWithoutWeddingInput[] | RSVPUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: RSVPCreateOrConnectWithoutWeddingInput | RSVPCreateOrConnectWithoutWeddingInput[]
    createMany?: RSVPCreateManyWeddingInputEnvelope
    connect?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EventUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<EventCreateWithoutWeddingInput, EventUncheckedCreateWithoutWeddingInput> | EventCreateWithoutWeddingInput[] | EventUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: EventCreateOrConnectWithoutWeddingInput | EventCreateOrConnectWithoutWeddingInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutWeddingInput | EventUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: EventCreateManyWeddingInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutWeddingInput | EventUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: EventUpdateManyWithWhereWithoutWeddingInput | EventUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type RSVPUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<RSVPCreateWithoutWeddingInput, RSVPUncheckedCreateWithoutWeddingInput> | RSVPCreateWithoutWeddingInput[] | RSVPUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: RSVPCreateOrConnectWithoutWeddingInput | RSVPCreateOrConnectWithoutWeddingInput[]
    upsert?: RSVPUpsertWithWhereUniqueWithoutWeddingInput | RSVPUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: RSVPCreateManyWeddingInputEnvelope
    set?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
    disconnect?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
    delete?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
    connect?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
    update?: RSVPUpdateWithWhereUniqueWithoutWeddingInput | RSVPUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: RSVPUpdateManyWithWhereWithoutWeddingInput | RSVPUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: RSVPScalarWhereInput | RSVPScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutWeddingsNestedInput = {
    create?: XOR<UserCreateWithoutWeddingsInput, UserUncheckedCreateWithoutWeddingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWeddingsInput
    upsert?: UserUpsertWithoutWeddingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWeddingsInput, UserUpdateWithoutWeddingsInput>, UserUncheckedUpdateWithoutWeddingsInput>
  }

  export type ThemeUpdateOneRequiredWithoutWeddingsNestedInput = {
    create?: XOR<ThemeCreateWithoutWeddingsInput, ThemeUncheckedCreateWithoutWeddingsInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutWeddingsInput
    upsert?: ThemeUpsertWithoutWeddingsInput
    connect?: ThemeWhereUniqueInput
    update?: XOR<XOR<ThemeUpdateToOneWithWhereWithoutWeddingsInput, ThemeUpdateWithoutWeddingsInput>, ThemeUncheckedUpdateWithoutWeddingsInput>
  }

  export type EventUncheckedUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<EventCreateWithoutWeddingInput, EventUncheckedCreateWithoutWeddingInput> | EventCreateWithoutWeddingInput[] | EventUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: EventCreateOrConnectWithoutWeddingInput | EventCreateOrConnectWithoutWeddingInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutWeddingInput | EventUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: EventCreateManyWeddingInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutWeddingInput | EventUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: EventUpdateManyWithWhereWithoutWeddingInput | EventUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type RSVPUncheckedUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<RSVPCreateWithoutWeddingInput, RSVPUncheckedCreateWithoutWeddingInput> | RSVPCreateWithoutWeddingInput[] | RSVPUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: RSVPCreateOrConnectWithoutWeddingInput | RSVPCreateOrConnectWithoutWeddingInput[]
    upsert?: RSVPUpsertWithWhereUniqueWithoutWeddingInput | RSVPUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: RSVPCreateManyWeddingInputEnvelope
    set?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
    disconnect?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
    delete?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
    connect?: RSVPWhereUniqueInput | RSVPWhereUniqueInput[]
    update?: RSVPUpdateWithWhereUniqueWithoutWeddingInput | RSVPUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: RSVPUpdateManyWithWhereWithoutWeddingInput | RSVPUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: RSVPScalarWhereInput | RSVPScalarWhereInput[]
  }

  export type WeddingCreateNestedOneWithoutEventsInput = {
    create?: XOR<WeddingCreateWithoutEventsInput, WeddingUncheckedCreateWithoutEventsInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutEventsInput
    connect?: WeddingWhereUniqueInput
  }

  export type WeddingUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<WeddingCreateWithoutEventsInput, WeddingUncheckedCreateWithoutEventsInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutEventsInput
    upsert?: WeddingUpsertWithoutEventsInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutEventsInput, WeddingUpdateWithoutEventsInput>, WeddingUncheckedUpdateWithoutEventsInput>
  }

  export type WeddingCreateNestedOneWithoutRsvpsInput = {
    create?: XOR<WeddingCreateWithoutRsvpsInput, WeddingUncheckedCreateWithoutRsvpsInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutRsvpsInput
    connect?: WeddingWhereUniqueInput
  }

  export type WeddingUpdateOneRequiredWithoutRsvpsNestedInput = {
    create?: XOR<WeddingCreateWithoutRsvpsInput, WeddingUncheckedCreateWithoutRsvpsInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutRsvpsInput
    upsert?: WeddingUpsertWithoutRsvpsInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutRsvpsInput, WeddingUpdateWithoutRsvpsInput>, WeddingUncheckedUpdateWithoutRsvpsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type OrderCreateWithoutUserInput = {
    id?: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bundle: BundleCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateWithoutUserInput = {
    id?: string
    bundleId: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCreateOrConnectWithoutUserInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderCreateManyUserInputEnvelope = {
    data: OrderCreateManyUserInput | OrderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WeddingCreateWithoutOwnerInput = {
    id?: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutWeddingInput
    rsvps?: RSVPCreateNestedManyWithoutWeddingInput
    theme: ThemeCreateNestedOneWithoutWeddingsInput
  }

  export type WeddingUncheckedCreateWithoutOwnerInput = {
    id?: string
    themeId: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutWeddingInput
    rsvps?: RSVPUncheckedCreateNestedManyWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutOwnerInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutOwnerInput, WeddingUncheckedCreateWithoutOwnerInput>
  }

  export type WeddingCreateManyOwnerInputEnvelope = {
    data: WeddingCreateManyOwnerInput | WeddingCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type OrderUpsertWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
  }

  export type OrderUpdateManyWithWhereWithoutUserInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutUserInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    userId?: StringFilter<"Order"> | string
    bundleId?: StringFilter<"Order"> | string
    totalAmount?: FloatFilter<"Order"> | number
    status?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
  }

  export type WeddingUpsertWithWhereUniqueWithoutOwnerInput = {
    where: WeddingWhereUniqueInput
    update: XOR<WeddingUpdateWithoutOwnerInput, WeddingUncheckedUpdateWithoutOwnerInput>
    create: XOR<WeddingCreateWithoutOwnerInput, WeddingUncheckedCreateWithoutOwnerInput>
  }

  export type WeddingUpdateWithWhereUniqueWithoutOwnerInput = {
    where: WeddingWhereUniqueInput
    data: XOR<WeddingUpdateWithoutOwnerInput, WeddingUncheckedUpdateWithoutOwnerInput>
  }

  export type WeddingUpdateManyWithWhereWithoutOwnerInput = {
    where: WeddingScalarWhereInput
    data: XOR<WeddingUpdateManyMutationInput, WeddingUncheckedUpdateManyWithoutOwnerInput>
  }

  export type WeddingScalarWhereInput = {
    AND?: WeddingScalarWhereInput | WeddingScalarWhereInput[]
    OR?: WeddingScalarWhereInput[]
    NOT?: WeddingScalarWhereInput | WeddingScalarWhereInput[]
    id?: StringFilter<"Wedding"> | string
    ownerId?: StringFilter<"Wedding"> | string
    themeId?: StringFilter<"Wedding"> | string
    groomName?: StringFilter<"Wedding"> | string
    brideName?: StringFilter<"Wedding"> | string
    groomParents?: StringNullableFilter<"Wedding"> | string | null
    brideParents?: StringNullableFilter<"Wedding"> | string | null
    rsvpContact?: StringNullableFilter<"Wedding"> | string | null
    rsvpDeadline?: DateTimeNullableFilter<"Wedding"> | Date | string | null
    invitationMessage?: StringNullableFilter<"Wedding"> | string | null
    createdAt?: DateTimeFilter<"Wedding"> | Date | string
    updatedAt?: DateTimeFilter<"Wedding"> | Date | string
  }

  export type ThemeCreateWithoutBundlesInput = {
    id?: string
    name: string
    description?: string | null
    thumbnailUrl?: string | null
    previewImages?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    isBestSeller?: boolean
    isPopular?: boolean
    weddings?: WeddingCreateNestedManyWithoutThemeInput
  }

  export type ThemeUncheckedCreateWithoutBundlesInput = {
    id?: string
    name: string
    description?: string | null
    thumbnailUrl?: string | null
    previewImages?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    isBestSeller?: boolean
    isPopular?: boolean
    weddings?: WeddingUncheckedCreateNestedManyWithoutThemeInput
  }

  export type ThemeCreateOrConnectWithoutBundlesInput = {
    where: ThemeWhereUniqueInput
    create: XOR<ThemeCreateWithoutBundlesInput, ThemeUncheckedCreateWithoutBundlesInput>
  }

  export type OrderCreateWithoutBundleInput = {
    id?: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateWithoutBundleInput = {
    id?: string
    userId: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCreateOrConnectWithoutBundleInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutBundleInput, OrderUncheckedCreateWithoutBundleInput>
  }

  export type OrderCreateManyBundleInputEnvelope = {
    data: OrderCreateManyBundleInput | OrderCreateManyBundleInput[]
    skipDuplicates?: boolean
  }

  export type ThemeUpsertWithoutBundlesInput = {
    update: XOR<ThemeUpdateWithoutBundlesInput, ThemeUncheckedUpdateWithoutBundlesInput>
    create: XOR<ThemeCreateWithoutBundlesInput, ThemeUncheckedCreateWithoutBundlesInput>
    where?: ThemeWhereInput
  }

  export type ThemeUpdateToOneWithWhereWithoutBundlesInput = {
    where?: ThemeWhereInput
    data: XOR<ThemeUpdateWithoutBundlesInput, ThemeUncheckedUpdateWithoutBundlesInput>
  }

  export type ThemeUpdateWithoutBundlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isBestSeller?: BoolFieldUpdateOperationsInput | boolean
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    weddings?: WeddingUpdateManyWithoutThemeNestedInput
  }

  export type ThemeUncheckedUpdateWithoutBundlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isBestSeller?: BoolFieldUpdateOperationsInput | boolean
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    weddings?: WeddingUncheckedUpdateManyWithoutThemeNestedInput
  }

  export type OrderUpsertWithWhereUniqueWithoutBundleInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutBundleInput, OrderUncheckedUpdateWithoutBundleInput>
    create: XOR<OrderCreateWithoutBundleInput, OrderUncheckedCreateWithoutBundleInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutBundleInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutBundleInput, OrderUncheckedUpdateWithoutBundleInput>
  }

  export type OrderUpdateManyWithWhereWithoutBundleInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutBundleInput>
  }

  export type BundleItemUpsertWithWhereUniqueWithoutBundleInput = {
    where: BundleItemWhereUniqueInput
    update: XOR<BundleItemUpdateWithoutBundleInput, BundleItemUncheckedUpdateWithoutBundleInput>
    create: XOR<BundleItemCreateWithoutBundleInput, BundleItemUncheckedCreateWithoutBundleInput>
  }

  export type BundleItemUpdateWithWhereUniqueWithoutBundleInput = {
    where: BundleItemWhereUniqueInput
    data: XOR<BundleItemUpdateWithoutBundleInput, BundleItemUncheckedUpdateWithoutBundleInput>
  }

  export type BundleItemUpdateManyWithWhereWithoutBundleInput = {
    where: BundleItemScalarWhereInput
    data: XOR<BundleItemUpdateManyMutationInput, BundleItemUncheckedUpdateManyWithoutBundleInput>
  }

  export type BundleItemScalarWhereInput = {
    AND?: BundleItemScalarWhereInput | BundleItemScalarWhereInput[]
    OR?: BundleItemScalarWhereInput[]
    NOT?: BundleItemScalarWhereInput | BundleItemScalarWhereInput[]
    id?: StringFilter<"BundleItem"> | string
    bundleId?: StringFilter<"BundleItem"> | string
    eventType?: StringFilter<"BundleItem"> | string
    templateName?: StringFilter<"BundleItem"> | string
    templateFile?: StringFilter<"BundleItem"> | string
    createdAt?: DateTimeFilter<"BundleItem"> | Date | string
    updatedAt?: DateTimeFilter<"BundleItem"> | Date | string
  }

  export type BundleCreateWithoutBundleItemsInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
    themeRef?: ThemeCreateNestedOneWithoutBundlesInput
    orders?: OrderCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateWithoutBundleItemsInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    themeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
    orders?: OrderUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleCreateOrConnectWithoutBundleItemsInput = {
    where: BundleWhereUniqueInput
    create: XOR<BundleCreateWithoutBundleItemsInput, BundleUncheckedCreateWithoutBundleItemsInput>
  }

  export type BundleUpsertWithoutBundleItemsInput = {
    update: XOR<BundleUpdateWithoutBundleItemsInput, BundleUncheckedUpdateWithoutBundleItemsInput>
    create: XOR<BundleCreateWithoutBundleItemsInput, BundleUncheckedCreateWithoutBundleItemsInput>
    where?: BundleWhereInput
  }

  export type BundleUpdateToOneWithWhereWithoutBundleItemsInput = {
    where?: BundleWhereInput
    data: XOR<BundleUpdateWithoutBundleItemsInput, BundleUncheckedUpdateWithoutBundleItemsInput>
  }

  export type BundleUpdateWithoutBundleItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
    themeRef?: ThemeUpdateOneWithoutBundlesNestedInput
    orders?: OrderUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateWithoutBundleItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: OrderUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type BundleCreateWithoutOrdersInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
    themeRef?: ThemeCreateNestedOneWithoutBundlesInput
    bundleItems?: BundleItemCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateWithoutOrdersInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    themeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
    bundleItems?: BundleItemUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleCreateOrConnectWithoutOrdersInput = {
    where: BundleWhereUniqueInput
    create: XOR<BundleCreateWithoutOrdersInput, BundleUncheckedCreateWithoutOrdersInput>
  }

  export type UserCreateWithoutOrdersInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isMobileVerified?: boolean
    mobileNumber: string
    role?: string
    status?: string
    weddings?: WeddingCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutOrdersInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isMobileVerified?: boolean
    mobileNumber: string
    role?: string
    status?: string
    weddings?: WeddingUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
  }

  export type BundleUpsertWithoutOrdersInput = {
    update: XOR<BundleUpdateWithoutOrdersInput, BundleUncheckedUpdateWithoutOrdersInput>
    create: XOR<BundleCreateWithoutOrdersInput, BundleUncheckedCreateWithoutOrdersInput>
    where?: BundleWhereInput
  }

  export type BundleUpdateToOneWithWhereWithoutOrdersInput = {
    where?: BundleWhereInput
    data: XOR<BundleUpdateWithoutOrdersInput, BundleUncheckedUpdateWithoutOrdersInput>
  }

  export type BundleUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
    themeRef?: ThemeUpdateOneWithoutBundlesNestedInput
    bundleItems?: BundleItemUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
    bundleItems?: BundleItemUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type UserUpsertWithoutOrdersInput = {
    update: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type UserUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isMobileVerified?: BoolFieldUpdateOperationsInput | boolean
    mobileNumber?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    weddings?: WeddingUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isMobileVerified?: BoolFieldUpdateOperationsInput | boolean
    mobileNumber?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    weddings?: WeddingUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type BundleCreateWithoutThemeRefInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
    orders?: OrderCreateNestedManyWithoutBundleInput
    bundleItems?: BundleItemCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateWithoutThemeRefInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
    orders?: OrderUncheckedCreateNestedManyWithoutBundleInput
    bundleItems?: BundleItemUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleCreateOrConnectWithoutThemeRefInput = {
    where: BundleWhereUniqueInput
    create: XOR<BundleCreateWithoutThemeRefInput, BundleUncheckedCreateWithoutThemeRefInput>
  }

  export type BundleCreateManyThemeRefInputEnvelope = {
    data: BundleCreateManyThemeRefInput | BundleCreateManyThemeRefInput[]
    skipDuplicates?: boolean
  }

  export type WeddingCreateWithoutThemeInput = {
    id?: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutWeddingInput
    rsvps?: RSVPCreateNestedManyWithoutWeddingInput
    owner: UserCreateNestedOneWithoutWeddingsInput
  }

  export type WeddingUncheckedCreateWithoutThemeInput = {
    id?: string
    ownerId: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutWeddingInput
    rsvps?: RSVPUncheckedCreateNestedManyWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutThemeInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutThemeInput, WeddingUncheckedCreateWithoutThemeInput>
  }

  export type WeddingCreateManyThemeInputEnvelope = {
    data: WeddingCreateManyThemeInput | WeddingCreateManyThemeInput[]
    skipDuplicates?: boolean
  }

  export type BundleUpsertWithWhereUniqueWithoutThemeRefInput = {
    where: BundleWhereUniqueInput
    update: XOR<BundleUpdateWithoutThemeRefInput, BundleUncheckedUpdateWithoutThemeRefInput>
    create: XOR<BundleCreateWithoutThemeRefInput, BundleUncheckedCreateWithoutThemeRefInput>
  }

  export type BundleUpdateWithWhereUniqueWithoutThemeRefInput = {
    where: BundleWhereUniqueInput
    data: XOR<BundleUpdateWithoutThemeRefInput, BundleUncheckedUpdateWithoutThemeRefInput>
  }

  export type BundleUpdateManyWithWhereWithoutThemeRefInput = {
    where: BundleScalarWhereInput
    data: XOR<BundleUpdateManyMutationInput, BundleUncheckedUpdateManyWithoutThemeRefInput>
  }

  export type BundleScalarWhereInput = {
    AND?: BundleScalarWhereInput | BundleScalarWhereInput[]
    OR?: BundleScalarWhereInput[]
    NOT?: BundleScalarWhereInput | BundleScalarWhereInput[]
    id?: StringFilter<"Bundle"> | string
    name?: StringFilter<"Bundle"> | string
    whatsappPrice?: IntFilter<"Bundle"> | number
    printablePrice?: IntFilter<"Bundle"> | number
    completePrice?: IntFilter<"Bundle"> | number
    isPopular?: BoolFilter<"Bundle"> | boolean
    theme?: StringFilter<"Bundle"> | string
    description?: StringNullableFilter<"Bundle"> | string | null
    isActive?: BoolFilter<"Bundle"> | boolean
    themeId?: StringNullableFilter<"Bundle"> | string | null
    createdAt?: DateTimeFilter<"Bundle"> | Date | string
    updatedAt?: DateTimeFilter<"Bundle"> | Date | string
    previewImages?: StringNullableFilter<"Bundle"> | string | null
    thumbnailUrl?: StringNullableFilter<"Bundle"> | string | null
    itemImages?: StringNullableFilter<"Bundle"> | string | null
  }

  export type WeddingUpsertWithWhereUniqueWithoutThemeInput = {
    where: WeddingWhereUniqueInput
    update: XOR<WeddingUpdateWithoutThemeInput, WeddingUncheckedUpdateWithoutThemeInput>
    create: XOR<WeddingCreateWithoutThemeInput, WeddingUncheckedCreateWithoutThemeInput>
  }

  export type WeddingUpdateWithWhereUniqueWithoutThemeInput = {
    where: WeddingWhereUniqueInput
    data: XOR<WeddingUpdateWithoutThemeInput, WeddingUncheckedUpdateWithoutThemeInput>
  }

  export type WeddingUpdateManyWithWhereWithoutThemeInput = {
    where: WeddingScalarWhereInput
    data: XOR<WeddingUpdateManyMutationInput, WeddingUncheckedUpdateManyWithoutThemeInput>
  }

  export type EventCreateWithoutWeddingInput = {
    id?: string
    name: string
    date: string
    time: string
    venue: string
    mapLink?: string | null
    description?: string | null
    eventType?: string | null
    rsvpDeadline?: string | null
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUncheckedCreateWithoutWeddingInput = {
    id?: string
    name: string
    date: string
    time: string
    venue: string
    mapLink?: string | null
    description?: string | null
    eventType?: string | null
    rsvpDeadline?: string | null
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventCreateOrConnectWithoutWeddingInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutWeddingInput, EventUncheckedCreateWithoutWeddingInput>
  }

  export type EventCreateManyWeddingInputEnvelope = {
    data: EventCreateManyWeddingInput | EventCreateManyWeddingInput[]
    skipDuplicates?: boolean
  }

  export type RSVPCreateWithoutWeddingInput = {
    id?: string
    guestName: string
    phone?: string | null
    adultCount?: number
    childCount?: number
    attending?: boolean
    status?: string
    dietary?: string | null
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RSVPUncheckedCreateWithoutWeddingInput = {
    id?: string
    guestName: string
    phone?: string | null
    adultCount?: number
    childCount?: number
    attending?: boolean
    status?: string
    dietary?: string | null
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RSVPCreateOrConnectWithoutWeddingInput = {
    where: RSVPWhereUniqueInput
    create: XOR<RSVPCreateWithoutWeddingInput, RSVPUncheckedCreateWithoutWeddingInput>
  }

  export type RSVPCreateManyWeddingInputEnvelope = {
    data: RSVPCreateManyWeddingInput | RSVPCreateManyWeddingInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutWeddingsInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isMobileVerified?: boolean
    mobileNumber: string
    role?: string
    status?: string
    orders?: OrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWeddingsInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isMobileVerified?: boolean
    mobileNumber: string
    role?: string
    status?: string
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWeddingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWeddingsInput, UserUncheckedCreateWithoutWeddingsInput>
  }

  export type ThemeCreateWithoutWeddingsInput = {
    id?: string
    name: string
    description?: string | null
    thumbnailUrl?: string | null
    previewImages?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    isBestSeller?: boolean
    isPopular?: boolean
    bundles?: BundleCreateNestedManyWithoutThemeRefInput
  }

  export type ThemeUncheckedCreateWithoutWeddingsInput = {
    id?: string
    name: string
    description?: string | null
    thumbnailUrl?: string | null
    previewImages?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    isBestSeller?: boolean
    isPopular?: boolean
    bundles?: BundleUncheckedCreateNestedManyWithoutThemeRefInput
  }

  export type ThemeCreateOrConnectWithoutWeddingsInput = {
    where: ThemeWhereUniqueInput
    create: XOR<ThemeCreateWithoutWeddingsInput, ThemeUncheckedCreateWithoutWeddingsInput>
  }

  export type EventUpsertWithWhereUniqueWithoutWeddingInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutWeddingInput, EventUncheckedUpdateWithoutWeddingInput>
    create: XOR<EventCreateWithoutWeddingInput, EventUncheckedCreateWithoutWeddingInput>
  }

  export type EventUpdateWithWhereUniqueWithoutWeddingInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutWeddingInput, EventUncheckedUpdateWithoutWeddingInput>
  }

  export type EventUpdateManyWithWhereWithoutWeddingInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutWeddingInput>
  }

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[]
    OR?: EventScalarWhereInput[]
    NOT?: EventScalarWhereInput | EventScalarWhereInput[]
    id?: StringFilter<"Event"> | string
    weddingId?: StringFilter<"Event"> | string
    name?: StringFilter<"Event"> | string
    date?: StringFilter<"Event"> | string
    time?: StringFilter<"Event"> | string
    venue?: StringFilter<"Event"> | string
    mapLink?: StringNullableFilter<"Event"> | string | null
    description?: StringNullableFilter<"Event"> | string | null
    eventType?: StringNullableFilter<"Event"> | string | null
    rsvpDeadline?: StringNullableFilter<"Event"> | string | null
    allowCompanions?: BoolFilter<"Event"> | boolean
    collectDietary?: BoolFilter<"Event"> | boolean
    maxGuests?: IntFilter<"Event"> | number
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
  }

  export type RSVPUpsertWithWhereUniqueWithoutWeddingInput = {
    where: RSVPWhereUniqueInput
    update: XOR<RSVPUpdateWithoutWeddingInput, RSVPUncheckedUpdateWithoutWeddingInput>
    create: XOR<RSVPCreateWithoutWeddingInput, RSVPUncheckedCreateWithoutWeddingInput>
  }

  export type RSVPUpdateWithWhereUniqueWithoutWeddingInput = {
    where: RSVPWhereUniqueInput
    data: XOR<RSVPUpdateWithoutWeddingInput, RSVPUncheckedUpdateWithoutWeddingInput>
  }

  export type RSVPUpdateManyWithWhereWithoutWeddingInput = {
    where: RSVPScalarWhereInput
    data: XOR<RSVPUpdateManyMutationInput, RSVPUncheckedUpdateManyWithoutWeddingInput>
  }

  export type RSVPScalarWhereInput = {
    AND?: RSVPScalarWhereInput | RSVPScalarWhereInput[]
    OR?: RSVPScalarWhereInput[]
    NOT?: RSVPScalarWhereInput | RSVPScalarWhereInput[]
    id?: StringFilter<"RSVP"> | string
    weddingId?: StringFilter<"RSVP"> | string
    guestName?: StringFilter<"RSVP"> | string
    phone?: StringNullableFilter<"RSVP"> | string | null
    adultCount?: IntFilter<"RSVP"> | number
    childCount?: IntFilter<"RSVP"> | number
    attending?: BoolFilter<"RSVP"> | boolean
    status?: StringFilter<"RSVP"> | string
    dietary?: StringNullableFilter<"RSVP"> | string | null
    message?: StringNullableFilter<"RSVP"> | string | null
    createdAt?: DateTimeFilter<"RSVP"> | Date | string
    updatedAt?: DateTimeFilter<"RSVP"> | Date | string
  }

  export type UserUpsertWithoutWeddingsInput = {
    update: XOR<UserUpdateWithoutWeddingsInput, UserUncheckedUpdateWithoutWeddingsInput>
    create: XOR<UserCreateWithoutWeddingsInput, UserUncheckedCreateWithoutWeddingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWeddingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWeddingsInput, UserUncheckedUpdateWithoutWeddingsInput>
  }

  export type UserUpdateWithoutWeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isMobileVerified?: BoolFieldUpdateOperationsInput | boolean
    mobileNumber?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    orders?: OrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isMobileVerified?: BoolFieldUpdateOperationsInput | boolean
    mobileNumber?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ThemeUpsertWithoutWeddingsInput = {
    update: XOR<ThemeUpdateWithoutWeddingsInput, ThemeUncheckedUpdateWithoutWeddingsInput>
    create: XOR<ThemeCreateWithoutWeddingsInput, ThemeUncheckedCreateWithoutWeddingsInput>
    where?: ThemeWhereInput
  }

  export type ThemeUpdateToOneWithWhereWithoutWeddingsInput = {
    where?: ThemeWhereInput
    data: XOR<ThemeUpdateWithoutWeddingsInput, ThemeUncheckedUpdateWithoutWeddingsInput>
  }

  export type ThemeUpdateWithoutWeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isBestSeller?: BoolFieldUpdateOperationsInput | boolean
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    bundles?: BundleUpdateManyWithoutThemeRefNestedInput
  }

  export type ThemeUncheckedUpdateWithoutWeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isBestSeller?: BoolFieldUpdateOperationsInput | boolean
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    bundles?: BundleUncheckedUpdateManyWithoutThemeRefNestedInput
  }

  export type WeddingCreateWithoutEventsInput = {
    id?: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rsvps?: RSVPCreateNestedManyWithoutWeddingInput
    owner: UserCreateNestedOneWithoutWeddingsInput
    theme: ThemeCreateNestedOneWithoutWeddingsInput
  }

  export type WeddingUncheckedCreateWithoutEventsInput = {
    id?: string
    ownerId: string
    themeId: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rsvps?: RSVPUncheckedCreateNestedManyWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutEventsInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutEventsInput, WeddingUncheckedCreateWithoutEventsInput>
  }

  export type WeddingUpsertWithoutEventsInput = {
    update: XOR<WeddingUpdateWithoutEventsInput, WeddingUncheckedUpdateWithoutEventsInput>
    create: XOR<WeddingCreateWithoutEventsInput, WeddingUncheckedCreateWithoutEventsInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutEventsInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutEventsInput, WeddingUncheckedUpdateWithoutEventsInput>
  }

  export type WeddingUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rsvps?: RSVPUpdateManyWithoutWeddingNestedInput
    owner?: UserUpdateOneRequiredWithoutWeddingsNestedInput
    theme?: ThemeUpdateOneRequiredWithoutWeddingsNestedInput
  }

  export type WeddingUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rsvps?: RSVPUncheckedUpdateManyWithoutWeddingNestedInput
  }

  export type WeddingCreateWithoutRsvpsInput = {
    id?: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutWeddingInput
    owner: UserCreateNestedOneWithoutWeddingsInput
    theme: ThemeCreateNestedOneWithoutWeddingsInput
  }

  export type WeddingUncheckedCreateWithoutRsvpsInput = {
    id?: string
    ownerId: string
    themeId: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutRsvpsInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutRsvpsInput, WeddingUncheckedCreateWithoutRsvpsInput>
  }

  export type WeddingUpsertWithoutRsvpsInput = {
    update: XOR<WeddingUpdateWithoutRsvpsInput, WeddingUncheckedUpdateWithoutRsvpsInput>
    create: XOR<WeddingCreateWithoutRsvpsInput, WeddingUncheckedCreateWithoutRsvpsInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutRsvpsInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutRsvpsInput, WeddingUncheckedUpdateWithoutRsvpsInput>
  }

  export type WeddingUpdateWithoutRsvpsInput = {
    id?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutWeddingNestedInput
    owner?: UserUpdateOneRequiredWithoutWeddingsNestedInput
    theme?: ThemeUpdateOneRequiredWithoutWeddingsNestedInput
  }

  export type WeddingUncheckedUpdateWithoutRsvpsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutWeddingNestedInput
  }

  export type OrderCreateManyUserInput = {
    id?: string
    bundleId: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingCreateManyOwnerInput = {
    id?: string
    themeId: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bundleId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bundleId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutWeddingNestedInput
    rsvps?: RSVPUpdateManyWithoutWeddingNestedInput
    theme?: ThemeUpdateOneRequiredWithoutWeddingsNestedInput
  }

  export type WeddingUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutWeddingNestedInput
    rsvps?: RSVPUncheckedUpdateManyWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateManyBundleInput = {
    id?: string
    userId: string
    totalAmount: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BundleItemCreateManyBundleInput = {
    id?: string
    eventType: string
    templateName: string
    templateFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleItemUpdateWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    templateName?: StringFieldUpdateOperationsInput | string
    templateFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleItemUncheckedUpdateWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    templateName?: StringFieldUpdateOperationsInput | string
    templateFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleItemUncheckedUpdateManyWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    templateName?: StringFieldUpdateOperationsInput | string
    templateFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleCreateManyThemeRefInput = {
    id?: string
    name: string
    whatsappPrice?: number
    printablePrice?: number
    completePrice?: number
    isPopular?: boolean
    theme?: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    previewImages?: string | null
    thumbnailUrl?: string | null
    itemImages?: string | null
  }

  export type WeddingCreateManyThemeInput = {
    id?: string
    ownerId: string
    groomName: string
    brideName: string
    groomParents?: string | null
    brideParents?: string | null
    rsvpContact?: string | null
    rsvpDeadline?: Date | string | null
    invitationMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BundleUpdateWithoutThemeRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: OrderUpdateManyWithoutBundleNestedInput
    bundleItems?: BundleItemUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateWithoutThemeRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: OrderUncheckedUpdateManyWithoutBundleNestedInput
    bundleItems?: BundleItemUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateManyWithoutThemeRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    whatsappPrice?: IntFieldUpdateOperationsInput | number
    printablePrice?: IntFieldUpdateOperationsInput | number
    completePrice?: IntFieldUpdateOperationsInput | number
    isPopular?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previewImages?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    itemImages?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WeddingUpdateWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutWeddingNestedInput
    rsvps?: RSVPUpdateManyWithoutWeddingNestedInput
    owner?: UserUpdateOneRequiredWithoutWeddingsNestedInput
  }

  export type WeddingUncheckedUpdateWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutWeddingNestedInput
    rsvps?: RSVPUncheckedUpdateManyWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateManyWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    groomName?: StringFieldUpdateOperationsInput | string
    brideName?: StringFieldUpdateOperationsInput | string
    groomParents?: NullableStringFieldUpdateOperationsInput | string | null
    brideParents?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpContact?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateManyWeddingInput = {
    id?: string
    name: string
    date: string
    time: string
    venue: string
    mapLink?: string | null
    description?: string | null
    eventType?: string | null
    rsvpDeadline?: string | null
    allowCompanions?: boolean
    collectDietary?: boolean
    maxGuests?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RSVPCreateManyWeddingInput = {
    id?: string
    guestName: string
    phone?: string | null
    adultCount?: number
    childCount?: number
    attending?: boolean
    status?: string
    dietary?: string | null
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    mapLink?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableStringFieldUpdateOperationsInput | string | null
    allowCompanions?: BoolFieldUpdateOperationsInput | boolean
    collectDietary?: BoolFieldUpdateOperationsInput | boolean
    maxGuests?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    mapLink?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableStringFieldUpdateOperationsInput | string | null
    allowCompanions?: BoolFieldUpdateOperationsInput | boolean
    collectDietary?: BoolFieldUpdateOperationsInput | boolean
    maxGuests?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    mapLink?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    rsvpDeadline?: NullableStringFieldUpdateOperationsInput | string | null
    allowCompanions?: BoolFieldUpdateOperationsInput | boolean
    collectDietary?: BoolFieldUpdateOperationsInput | boolean
    maxGuests?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RSVPUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    adultCount?: IntFieldUpdateOperationsInput | number
    childCount?: IntFieldUpdateOperationsInput | number
    attending?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    dietary?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RSVPUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    adultCount?: IntFieldUpdateOperationsInput | number
    childCount?: IntFieldUpdateOperationsInput | number
    attending?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    dietary?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RSVPUncheckedUpdateManyWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    adultCount?: IntFieldUpdateOperationsInput | number
    childCount?: IntFieldUpdateOperationsInput | number
    attending?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    dietary?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BundleCountOutputTypeDefaultArgs instead
     */
    export type BundleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BundleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ThemeCountOutputTypeDefaultArgs instead
     */
    export type ThemeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ThemeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WeddingCountOutputTypeDefaultArgs instead
     */
    export type WeddingCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WeddingCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OTPRequestDefaultArgs instead
     */
    export type OTPRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OTPRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BundleDefaultArgs instead
     */
    export type BundleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BundleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BundleItemDefaultArgs instead
     */
    export type BundleItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BundleItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderDefaultArgs instead
     */
    export type OrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ThemeDefaultArgs instead
     */
    export type ThemeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ThemeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WeddingDefaultArgs instead
     */
    export type WeddingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WeddingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventDefaultArgs instead
     */
    export type EventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RSVPDefaultArgs instead
     */
    export type RSVPArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RSVPDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PackageDefaultArgs instead
     */
    export type PackageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PackageDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}