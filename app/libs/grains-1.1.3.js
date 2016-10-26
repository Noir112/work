/**
 * Created by valera on 21.05.16.
 *
 * GrainsJs - framework для организации пространств имен
 * пиложения и созадния модулей в одну единую систему
 * @version 1.1.2
 */

/**
 * @step 1 - создание объекта приложения.
 *
 * Для создания приложения необходимо воспользоваться методом application(name).
 *
 * window.grains.application("ApplicationName");
 *
 * или
 *
 * var app = grains.application("ApplicationName");
 *
 * после чего можно приступать к формированию модулей и разделению их
 * по собственным пространствам имен, для исключения конфликтов.
 *
 * @step 2 - создание пространств имен.
 *
 * Пространства имен служат контейнерами для хранения добавленных модулей приложения,
 * которые еще не были инициализироваными и модулей, инициализация которых уже была
 * выполнена. Для этого существуют два корневых объекта под именами:
 * modules - объект, в который добавляются модуля
 * initModules - объект, в который добавляются соответствующие инициализированные
 * экземпляры из объекта modules.
 *
 * Для создания пространтсва имен следует воспользоваться методом createNameSpace(namespace).
 *
 * window
 *      .grains
 *      .application("ApplicationName")
 *      .createNameSpace("modules.name.space");
 *
 * или
 *
 * var app = grains.application("ApplicationName");
 *
 * app.createNameSpace("modules.name.space");
 *
 *
 * где - "ApplicationName" - имя объекта создаваемого приложения,
 *       "modules.name.space" - имя цепочки вложенного пространтва имен
 *
 * После выполненных операций получаем примерно такую структуру:
 *
 * var applicationName = {
 *          name: {
 *              space: {}
 *          }
 *     };
 *
 * При вызове метода app.createNameSpace("modules.name.space") корень в виде "modules."
 * можно опустить и укзать просто app.createNameSpace("name.space"),
 * тогда созданное пространство имен будет автоматом помещено в корневой объект modules.
 * Именно этот корневой объект следует использовать при добавлении модулей, а не
 * initModules, чтобы избежать путаниц между модулями и их инициализированных экземпляров.
 *
 * @step 3 - добавление модулей.
 *
 * Для добавления нового модуля, следует воспользовать методом module("moduleName", function)
 * объекта от созданного пространства имен.
 *
 * grains
 *      .application("ApplicationName")
 *      .createNameSpace("modules.name.space")
 *      .module("Module", function () {
 *          var userName = "Jack";
 *
 *          this.prop = 1;
 *
 *          this.method = function () {
 *              return this.prop + 3;
 *          }
 *      });
 *
 * При более сложной компановке модуля следует использовать конструкцию:
 *
 * grains
 *      .application("ApplicationName")
 *      .createNameSpace("modules.name.space")
 *      .module("Module", (function () {
 *          function Module() {
 *              var userName = "Jack";
 *
 *              this.prop = 1;
 *
 *              this.method = function () {
 *                  return this.prop + 3;
 *              }
 *          }
 *
 *          Module.prototype.defaultSettings = {};
 *
 *          return Module;
 *      }()));
 *
 * Или любую другую, но вторым аргументом метода module должна быть
 * в итоге функция-конструктор, которая будет вызвана при инициализации через new.
 *
 * @step 4 - инициализация добавленных модулей.
 *
 * Как уже ранее было сказано, модуля добавляются в корневое пространство имен
 * начинающеся с объекта под именем modules, а инициализированные экземпляры
 * помещаются в корневой объект с именем  initModules, для этого необходимо
 * воспользовать методом factory(options) объекта приложения, который принимает
 * один аргумент - конфигурационный объект.
 *
 * options = {
 *      nameSpace: {string},        - пространство имент вида "modules.name.space" -
 *                                    в котором содержится добавленный модуль
 *      moduleName: {string},       - имя модуля, под которым хранится инициализируемый модуль
 *      createNameSpace: {string},  - пространство имент вида "initModules.name.space" -
 *                                    куда будет помещен инициализированный экземпляр модуля
 *      initModuleName: {string},   - имя инициализированного экземпляра модуля, под которым он
 *                                    будет хранится в созданном пространстве имен
 *      settings: {*}               - значение любого типа, которое будет передано модулю в
 *                                    качестве первого аргуента при его инициализации
 * }
 *
 * var app = grains.application("ApplicationName");
 *
 * app.factory({
 *      nameSpace: "modules.name.space",
 *      moduleName: "Module",
 *      createNameSpace: "initModules.name.space",
 *      initModuleName: "initModuleName",
 *      settings: {}
 * });
 *
 * app.factory({// создание 2го экземпляра модуля с именем Module, но уже под именем initModuleName2
 *      nameSpace: "modules.name.space",
 *      moduleName: "Module",
 *      createNameSpace: "initModules.name.space",
 *      initModuleName: "initModuleName2",
 *      settings: {}
 * });
 *
 * @step 5 - разрешения зависимостей между инициализированными модулями.
 *
 * Для формирования объекта, который будет содержать в себе список модулей,
 * от кторых зависит инициализированный модуль необходимо воспользоваться методом
 * dependencyInjection(arrayOfDependencies) объекта приложения, который принимает
 * один аргумент - массив объектов, с описанием зависимых модулей.
 * Созданный объект с модулями можно передать в инициализированный экземпляр модуля
 * в параметре settings.
 *
 * var app = grains.application("ApplicationName");
 *
 * app
 *      .createNameSpace("modules.name.space")
 *      .module("Module", (function () {
 *          function Module(opts) {
 *              var userName = opts.name;
 *
 *              this.getUserName = function () {
 *                  return userName;
 *              }
 *          }
 *
 *          Module.prototype.defaultSettings = {};
 *
 *          return Module;
 *      }()))
 *      .module("Module2", (function () {
 *          function Module2(opts) {
 *              var Module = dependencies.Module;
 *
 *              (function init() {
 *                  alert(Module.getUserName()); //"Jack"
 *              }());
 *          }
 *
 *          Module2.prototype.defaultSettings = {};
 *
 *          return Module2;
 *      }()));;
 *
 * app.factory({
 *      nameSpace: "modules.name.space",
 *      moduleName: "Module",
 *      createNameSpace: "initModules.name.space",
 *      initModuleName: "initModuleName",
 *      settings: {
 *          name: "Jack"
 *      }
 * });
 *
 * app.factory({
 *      nameSpace: "modules.name.space",
 *      moduleName: "Module2",
 *      createNameSpace: "initModules.name.space",
 *      initModuleName: "initModuleName2",
 *      settings: {
 *          dependencies: app.dependencyInjection([
 *              {nameSpace: "initModules.name.space", moduleName: "initModuleName", alias: "Module"}
 *          ])
 *      }
 * });
 *
 */
(function (window) {
    "use strict";
    var
        /**
         * Св-во содержит идентификаторы
         * для различных типов данных,
         * возвращаемых методом toString объекта
         *
         * @property typesOfData
         * @type {{array: string, object: string}}
         */
        typesOfData = {
            array: "[object Array]",
            object: "[object Object]",
            func: "[object Function]",
            string: "[object String]"
        },
        /**
         * Св-во содержит объект-прототип
         * с методами для каждого объекта
         * состовляющего цепочку нейм-спейсов
         *
         * @property
         * @type {Object}
         */
        protoForNameSpace = null;

    /**
     * Метод генерации стандартной
     * ошибки типа Error
     *
     * @method triggerError
     * @param message {string} - сообщение об ошибке
     * @returns {void}
     */
    function triggerError(message) {
        throw new Error(message);
    }

    /**
     * Метод запечатывает
     * указыннй объект
     *
     * @method sealObject
     * @param object {Object}
     * @returns {Object}
     */
    function sealObject(object) {
        if (Object.seal) {
            Object.seal(object);
        }

        return object;
    }

    /**
     * Метод создает новый пустой
     * объект с указанным прототипом
     *
     * @method inherit
     * @param proto {Object} - объект прототип
     * @returns {Object} - новый пустой объект с прототипом proto
     */
    function inherit(proto) {
        var newObject;

        function F() {
            return this;
        }

        if (Object.create) {
            newObject = Object.create(proto);
        } else {
            F.prototype = proto;
            newObject = new F();
        }

        return newObject;
    }

    /**
     * Метод определяет,
     * является ли указаное значение
     * объектом или нет
     *
     * @method isObject
     * @param value {*} - значение любого типа данных
     * @returns {boolean}
     */
    function isObject(value) {
        return {}.toString.call(value) === typesOfData.object;
    }

    /**
     * Метод определяет,
     * является ли указаное значение
     * массивом или нет
     *
     * @method isArray
     * @param value {*} - значение любого типа данных
     * @returns {boolean}
     */
    function isArray(value) {
        return {}.toString.call(value) === typesOfData.array;
    }

    /**
     * Метод определяет,
     * явдяется ли значение функцией
     *
     * @method isFunction
     * @param value {*} - значение любого типа данных
     * @returns {boolean}
     */
    function isFunction(value) {
        return {}.toString.call(value) === typesOfData.func;
    }

    /**
     * Метод определяет,
     * явдяется ли значение строкой
     *
     * @method isString
     * @param value {*} - значение любого типа данных
     * @returns {boolean}
     */
    function isString(value) {
        return {}.toString.call(value) === typesOfData.string;
    }

    /**
     * Метод расширяет указнный
     * объект перечислимыми св-вами
     * объектов указанными в прочих аргументах
     *
     * @method extend
     * @param origin {Object}
     * @returns {Object}
     */
    function extend(origin) {
        var args = [].slice.call(arguments, 1);

        args.forEach(function (obj) {
            var prop;

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (isObject(obj[prop])) {
                        origin[prop] = extend({}, obj[prop]);
                    } else {
                        origin[prop] = obj[prop];
                    }
                }
            }
        });

        return origin;
    }

    protoForNameSpace = {
        /**
         * Метод регистрирует
         * функцию-конструктор нового модуля
         *
         * @method module
         * @param name {string} - имя регистрируемого модуля
         * @param func {Function} - функция-конструктор модуля
         * @returns {protoForNameSpace}
         */
        module: function (name, func) {
            if (!name || !isFunction(func)) {
                triggerError("Registering module: invalid input arguments: " + name + "; " + func);
            }

            if (this[name]) {
                triggerError("Registering module: module ('" + name + "')" + " is defined");
            }

            this[name] = func;

            return this;
        }
    };

    /**
     * Метод создает новый объек в
     * указанном объекте под указанным
     * именем или возвращает существующий
     *
     * @method createNewObject
     * @param current{Object} - объект, в котором
     * необходимо создать новый объект
     * @param name{String} - имя для нового объекта
     * @returns {object} - созданный объект либо уже существующий
     */
    function createNewObject(current, name) {
        var newObject;

        if (!current || !name) {
            triggerError("'createNameSpace:' input arguments is invalid");
        }

        newObject = current[name] || inherit(protoForNameSpace);
        current[name] = newObject;

        if (!isObject(newObject)) {
            triggerError("'createNameSpace:' '" + name + "' is not an object");
        }

        return newObject;
    }

    /**
     * Метод осщуествляет
     * поиск элементов по указанному селектру,
     * с возможностью осуществлять поиск у родительского
     * элемента, содержащегося в параметре context
     *
     * @method findElements
     * @param selector {string} - css selector
     * @param [context] {Object} - DOM element
     * @param [toArray] {boolean} - result always in array
     * @returns {Array|Object|null}
     */
    function findElements(selector, context, toArray) {
        var elements = [].slice.call((context || window.document).querySelectorAll(selector)),
            result = !toArray ? null : [];

        result = elements.length ? elements : result;

        if (!toArray && elements.length === 1) {
            result = elements.pop();
        }

        return result;
    }

    /**
     * Модуль создания
     * утилит для указанного модуля
     *
     * @constructor
     * @param module {Object}
     * @param options {Object} - options of current module
     * @this {UtilityCreation}
     */
    function UtilityCreation(module, options) {
        var
            /**
             * Св-во содержит набор
             * создаваемых утилит для модуля
             *
             * @property utilities
             * @type {{elements: {}}}
             */
            utilities = {
                elements: {}
            },
            /**
             * Св-во содержит
             * объект-контейнер для
             * DOM элементов модуля
             *
             * @property elements
             * @type {Object}
             */
            elements = utilities.elements,
            /**
             * Св-во содержит набор внешних
             * алгоритмов
             *
             * @property custom
             * @type {{findElements: Function}|{}}
             */
            custom = window.grains.custom || {},
            /**
             * Св-во содержит алгоритм
             * поиска DOM элементов
             *
             * @property find
             * @type {Function}
             */
            find = isFunction(custom.findElements) ? custom.findElements : findElements,
            /**
             * Св-во содержит текущие
             * настройки модуля
             *
             * @property settings
             * @type {Object}
             */
            settings = options.settings,
            /**
             * Св-во содержит настройки
             * модуля по умолчанию
             *
             * @property defaultSettings
             * @type {Object}
             */
            defaultSettings = null,
            /**
             * Св-во содержит идентификаторы
             * для DOM элементов по умолчанию
             *
             * @property defaultIdentifiers
             * @type {Object}
             */
            defaultIdentifiers = null,
            /**
             * Св-во содержит конечный набор
             * идентификаторов для DOM элементов
             *
             * @property identifiers
             * @type {Object}
             */
            identifiers = null;

        /**
         * Метод возвращает
         * имя указанного модуля
         *
         * @method getModuleName
         * @returns {string}
         */
        function getModuleName() {
            var strModule = String(module);

            return strModule.slice(0, strModule.indexOf("("));
        }

        /**
         * Метод проверяет, объявлен ли модуль
         * в строгом режиме или нет, если не указано явно
         * отдается предпочтение глобальным настройкам
         *
         *
         * @method isStrictMode
         * @returns {boolean}
         */
        function isStrictMode() {
            var prop = "strictMode";

            return options.hasOwnProperty(prop) ? Boolean(options[prop]) : Boolean(custom[prop]);
        }

        /**
         * Метод возвращает объект
         * идентификаторов из настроек для модуля
         *
         * @method getIdentifiers
         * @returns {Object}
         */
        function getIdentifiers() {
            return (isObject(settings) && isObject(settings.identifiers) && settings.identifiers) || {};
        }

        /**
         * Метод создает DOM элемены
         * под укзанными именами с соответствующими
         * селекторами идентификаторов
         *
         * @method createElements
         * @returns {void}
         */
        function createElements() {
            var prefixName = "$",
                error = "Finding elements: element (name: {name}; selector: {selector}; module: {moduleName}) is not found.",
                prop;

            for (prop in identifiers) {
                if (identifiers.hasOwnProperty(prop) && identifiers[prop] && prop !== "module") {
                    elements[prefixName + prop] = find(identifiers[prop], elements.$module);

                    if (isStrictMode() && !elements[prefixName + prop]) {
                        triggerError(
                            error.replace("{name}", prop)
                                 .replace("{selector}", identifiers[prop])
                                 .replace("{moduleName}", getModuleName())
                        );
                    }
                }
            }
        }

        /**
         * Метод инициализации DOM
         * элементов для указанного модуля
         *
         * @method initElements
         * @returns {void}
         */
        function initElements() {
            elements.$module = find(identifiers.module);

            if (elements.$module) {
                createElements();
            }
        }

        /**
         * Метод возвращает объект
         * созданных утилит
         *
         * @method getUtilities
         * @returns {{elements: {}}}
         */
        this.getUtilities = function () {
            return utilities;
        };

        /**
         * конструктор модуля
         * создания утилит
         *
         * @method init
         * @returns {void}
         */
        (function init() {
            defaultSettings = module.prototype.defaultSettings || {};
            defaultIdentifiers = defaultSettings.identifiers || {};
            identifiers = extend({}, defaultIdentifiers, getIdentifiers());
            initElements();
        }());
    }

    /**
     * Конструктор модуля создания
     * экземпляра объекта
     * для хранения данных приложения
     *
     * @constructor
     * @this {Application}
     */
    function Application() {
        /**
         * Текущая версия
         *
         * @property version
         * @type {Object}
         */
        this.version = null;
        /**
         * Объект для регистрации модулей
         *
         * @property modules
         * @type {Object}
         */
        this.modules = inherit(protoForNameSpace);
        /**
         * Объект для инициализированных модулей
         *
         * @property initModules
         * @type {Object}
         */
        this.initModules = inherit(protoForNameSpace);

        return sealObject(this);
    }

    /**
     * Метод устанавливает
     * версию разрабатывамого приложения
     *
     * @method setVersion
     * @param version{*} - версия приложения
     * @returns {Application}
     */
    Application.prototype.setVersion = function (version) {
        this.version = version;

        return this;
    };

    /**
     * Метод создает новое пространство имен
     * в котором будут регистрироваться модуля
     *
     * @method createNameSpace
     * @param nameSpace{String} - имя для нового неймспейса: "modules.newNameSpace.newSubNameSpace" || "newNameSpace.newSubNameSpace"
     * @returns {object} - созданный объект неймспейса либо уже существующий
     */
    Application.prototype.createNameSpace = function (nameSpace) {
        var self = this,
            modules,
            initialNameSpace,
            createNewNameSpace;

        if (!nameSpace) {
            triggerError("'createNameSpace': namespace is undefined");
        }

        nameSpace = nameSpace.split(".");
        initialNameSpace = nameSpace[0];

        if (initialNameSpace === "modules" || initialNameSpace === "initModules") {
            modules = this[initialNameSpace];
            nameSpace.shift();
        }

        nameSpace.forEach(function (name) {
            createNewNameSpace = createNewObject(createNewNameSpace || modules || self.modules, name);
        });

        return createNewNameSpace || modules;
    };

    /**
     * Метод возвращает объект
     * необходимого неймспейса
     *
     * @method getNameSpace
     * @param nameSpace {String} - строка необходимого неймспейса:
     * 'modules.newNameSpace.newSubNameSpace' || 'initModules.newNameSpace.newSubNameSpace'
     * @return {Object|undefined} - объект искомого неймспейса если он есть
     */
    Application.prototype.getNameSpace = function (nameSpace) {
        var initialNameSpace,
            currentNameSpace;

        if (!nameSpace) {
            triggerError("'getNameSpace': namespace is undefined");
        }

        nameSpace = nameSpace.split(".");//todo extract separator
        initialNameSpace = nameSpace[0];//todo extract magic number

        if (!(initialNameSpace === "modules" || initialNameSpace === "initModules")) {
            triggerError("'getNameSpace': namespace: '" + nameSpace.join('.') + "' is not defined");
        }

        initialNameSpace = this[initialNameSpace];
        nameSpace.shift();

        nameSpace.forEach(function (name) {
            if (currentNameSpace) {
                if (!isObject(currentNameSpace)) {
                    triggerError("'getNameSpace': part of the namespace: '" + nameSpace.join('.') + "' is not an object");
                }

                currentNameSpace = currentNameSpace[name];
            } else {
                currentNameSpace = initialNameSpace[name];
            }
        });

        return currentNameSpace;
    };

    /**
     * Метод возвращает объект
     * модулей
     *
     * @method dependencyInjection
     * @param dependencies {Array} - массив объектов с зависимостями вида:
     *
     * {
         *  nameSpace: {String}, - строка неймспейса с нужным модулем
         *  moduleName: {String},- имя модуля
         *  alias: {String} - псевдоним, под которым будет указан модуль
         * }
     *
     * @returns {Object} - объект с
     */
    Application.prototype.dependencyInjection = function (dependencies) {
        var self = this,
            dependency = {};

        if (!isArray(dependencies)) {
            triggerError("dependencyInjection: injections dependencies is not an array");
        }

        dependencies.forEach(function (dependencyInfo) {
            var nameSpace = self.getNameSpace(dependencyInfo.nameSpace),
                module;

            if (!nameSpace) {
                triggerError("dependencyInjection: namespace '" + dependencyInfo.nameSpace + "' is not defined");
            }

            module = nameSpace[dependencyInfo.moduleName];

            if (!module) {
                triggerError("dependencyInjection: module '" + dependencyInfo.moduleName + "' (namespace: " + dependencyInfo.nameSpace +  ") is not defined");
            }

            dependency[dependencyInfo.alias] = module;
        });

        return dependency;
    };

    /**
     * Фабричный метод инициализации модулей
     *
     * @method factory
     * @param options {Object} - объект с настройками инициализации указанного модуля
     * {
     *     nameSpace: "modules.namespace", - строка неймспейса с нужным модулем
     *     createNameSpace: "initModules.namespace", - строка неймспейса, кторый будет создан для экземпляра инициализированного модуля
     *     moduleName: "ModuleName", - имя модуля
     *     initModuleName: "ModuleName", - имя инициализированного экземпляра модуля
     *     settings: {} - конфигурационный объект, который будет передан конструктору модуля
     * }
     * @returns {Object} - экземпляр объекта инициализированного модуля
     *
     * "modules.companiesConstructor", "CompaniesConstructor", "CompaniesConstructor", {}
     */
    Application.prototype.factory = function (options) {
        var targetNameSpace = this.getNameSpace(options.nameSpace),
            targetInitNameSpace = this.createNameSpace(options.createNameSpace),
            hasOwn = {}.hasOwnProperty,
            Module,
            initModule;

        if (!targetNameSpace) {
            triggerError("Factory: namespace: '" + options.nameSpace + "' is not defined");
        }

        if (!hasOwn.call(targetNameSpace, options.moduleName)) {
            triggerError("Factory: module '" + options.moduleName + "' (namespace: " + options.nameSpace + ")" + " is not defined");
        }

        if (hasOwn.call(targetInitNameSpace, options.initModuleName)) {
            triggerError("Factory: init module name: '" + options.initModuleName + "' (namespace: " + options.createNameSpace + ")" + " is defined");
        }

        Module = targetNameSpace[options.moduleName];

        initModule = targetInitNameSpace[options.initModuleName] = new Module(
            options.settings,
            new UtilityCreation(Module, options).getUtilities()
        );

        return initModule;
    };

    /**
     * Метод удаляет модуль в указанном
     * пространстве имен по его имени
     *
     * @method removeModule
     * @param nameSpace {string}
     * @param moduleName {string}
     * @returns {Object|undefined}
     */
    Application.prototype.removeModule = function (nameSpace, moduleName) {
        var container = this.getNameSpace(nameSpace),
            module = container[moduleName];

        delete container[moduleName];

        return module;
    };

    /**
     * Констрктор фреймворка
     * по созданию независимых
     * приложений
     *
     * @constructor
     * @this {Grains}
     */
    function Grains() {
        var
            /**
             * Св-во хранит созданные
             * приложения
             *
             * @property applications
             * @type {{}}
             */
            applications = {};

        /**
         * Св-во содержит объект
         * для расширения пользовательскими
         * алгоритмами и настройками фреймворка
         *
         * @property custom
         * @type {{strictMode: boolean, findElements: null, appNames: {}}}
         */
        this.custom = {
            strictMode: false,
            findElements: null,
            appNames: {}
        };

        /**
         * Св-во содержит набор
         * вспомогательных методов
         *
         * @property utilities
         * @type {Object}
         */
        this.utilities = {
            isArray: isArray,
            isObject: isObject,
            isFunction: isFunction,
            isString: isString,
            extend: extend,
            sealObject: sealObject,
            noop: function () {return; },
            findElements: findElements
        };

        /**
         * Метод создает новое приложение
         * или возвращает ранее созданное
         * по указанному имени
         *
         * @method application
         * @param name {string} - имя создаваемого приложения
         * @returns {*}
         */
        this.application = function (name) {
            var app = applications[name];

            if (!app) {
                app = applications[name] = new Application();
            }

            return app;
        };

        sealObject(this.custom);

        return sealObject(this);
    }

    window.grains = new Grains();
}(this));