"use strict";
function require( path ){ return $node[ path ] };
"use strict";

;
"use strict";

;
"use strict";

;
"use strict";

;
"use strict";

;
"use strict";
var $;
(function ($_1) {
    function $mol_test(set) {
        for (let name in set) {
            const code = set[name];
            const test = (typeof code === 'string') ? new Function('', code) : code;
            $_1.$mol_test_all.push(test);
        }
        $mol_test_schedule();
    }
    $_1.$mol_test = $mol_test;
    $_1.$mol_test_mocks = [];
    $_1.$mol_test_all = [];
    async function $mol_test_run() {
        for (var test of $_1.$mol_test_all) {
            let context = Object.create($$);
            for (let mock of $_1.$mol_test_mocks)
                await mock(context);
            const res = test(context);
            if ($mol_promise_like(res)) {
                await new Promise((done, fail) => {
                    res.then(done, fail);
                    setTimeout(() => fail(new Error('Test timeout: ' + test.name)), 1000);
                });
            }
        }
        $$.$mol_log3_done({
            place: '$mol_test',
            message: 'All tests passed',
            count: $_1.$mol_test_all.length,
        });
    }
    $_1.$mol_test_run = $mol_test_run;
    let scheduled = false;
    function $mol_test_schedule() {
        if (scheduled)
            return;
        scheduled = true;
        setTimeout(async () => {
            scheduled = false;
            await $mol_test_run();
            $$.$mol_test_complete();
        }, 1000);
    }
    $_1.$mol_test_schedule = $mol_test_schedule;
    $_1.$mol_test_mocks.push(context => {
        let seed = 0;
        context.Math = Object.create(Math);
        context.Math.random = () => Math.sin(seed++);
        const forbidden = ['XMLHttpRequest', 'fetch'];
        for (let api of forbidden) {
            context[api] = new Proxy(function () { }, {
                get() {
                    $mol_fail_hidden(new Error(`${api} is forbidden in tests`));
                },
                apply() {
                    $mol_fail_hidden(new Error(`${api} is forbidden in tests`));
                },
            });
        }
    });
    $mol_test({
        'mocked Math.random'($) {
            console.assert($.Math.random() === 0);
            console.assert($.Math.random() === Math.sin(1));
        },
        'forbidden XMLHttpRequest'($) {
            try {
                console.assert(void new $.XMLHttpRequest);
            }
            catch (error) {
                console.assert(error.message === 'XMLHttpRequest is forbidden in tests');
            }
        },
        'forbidden fetch'($) {
            try {
                console.assert(void $.fetch(''));
            }
            catch (error) {
                console.assert(error.message === 'fetch is forbidden in tests');
            }
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    function $mol_test_complete() {
    }
    $.$mol_test_complete = $mol_test_complete;
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    /**
     * Argument must be Truthy
     * @deprecated use $mol_assert_equal instead
     */
    function $mol_assert_ok(value) {
        if (value)
            return;
        $mol_fail(new Error(`${value} ≠ true`));
    }
    $.$mol_assert_ok = $mol_assert_ok;
    /**
     * Argument must be Falsy
     * @deprecated use $mol_assert_equal instead
     */
    function $mol_assert_not(value) {
        if (!value)
            return;
        $mol_fail(new Error(`${value} ≠ false`));
    }
    $.$mol_assert_not = $mol_assert_not;
    /**
     * Handler must throw an error.
     * @example
     * $mol_assert_fail( ()=>{ throw new Error( 'Parse error' ) } ) // Passes because throws error
     * $mol_assert_fail( ()=>{ throw new Error( 'Parse error' ) } , 'Parse error' ) // Passes because throws right message
     * $mol_assert_fail( ()=>{ throw new Error( 'Parse error' ) } , Error ) // Passes because throws right class
     * @see https://mol.hyoo.ru/#!section=docs/=9q9dv3_fgxjsf
     */
    function $mol_assert_fail(handler, ErrorRight) {
        const fail = $.$mol_fail;
        try {
            $.$mol_fail = $.$mol_fail_hidden;
            handler();
        }
        catch (error) {
            $.$mol_fail = fail;
            if (typeof ErrorRight === 'string') {
                $mol_assert_equal(error.message ?? error, ErrorRight);
            }
            else {
                $mol_assert_equal(error instanceof ErrorRight, true);
            }
            return error;
        }
        finally {
            $.$mol_fail = fail;
        }
        $mol_fail(new Error('Not failed', { cause: { expect: ErrorRight } }));
    }
    $.$mol_assert_fail = $mol_assert_fail;
    /** @deprecated Use $mol_assert_equal */
    function $mol_assert_like(...args) {
        $mol_assert_equal(...args);
    }
    $.$mol_assert_like = $mol_assert_like;
    /**
     * All arguments must not be structural equal to each other.
     * @example
     * $mol_assert_unique( 1 , 2 , 3 ) // Passes
     * $mol_assert_unique( 1 , 1 , 2 ) // Fails because 1 === 1
     * @see https://mol.hyoo.ru/#!section=docs/=9q9dv3_fgxjsf
     */
    function $mol_assert_unique(...args) {
        for (let i = 0; i < args.length; ++i) {
            for (let j = 0; j < args.length; ++j) {
                if (i === j)
                    continue;
                if (!$mol_compare_deep(args[i], args[j]))
                    continue;
                return $mol_fail(new Error(`Uniquesess assertion failure`, { cause: { [i]: args[i], [i]: args[i] } }));
            }
        }
    }
    $.$mol_assert_unique = $mol_assert_unique;
    /**
     * All arguments must be structural equal each other.
     * @example
     * $mol_assert_like( [1] , [1] , [1] ) // Passes
     * $mol_assert_like( [1] , [1] , [2] ) // Fails because 1 !== 2
     * @see https://mol.hyoo.ru/#!section=docs/=9q9dv3_fgxjsf
     */
    function $mol_assert_equal(...args) {
        for (let i = 1; i < args.length; ++i) {
            if ($mol_compare_deep(args[0], args[i]))
                continue;
            return $mol_fail(new Error(`Equality assertion failure`, { cause: { 0: args[0], [i]: args[i] } }));
        }
    }
    $.$mol_assert_equal = $mol_assert_equal;
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'must be false'() {
            $mol_assert_not(0);
        },
        'must be true'() {
            $mol_assert_ok(1);
        },
        'two must be equal'() {
            $mol_assert_equal(2, 2);
        },
        'three must be equal'() {
            $mol_assert_equal(2, 2, 2);
        },
        'two must be unique'() {
            $mol_assert_unique([2], [3]);
        },
        'three must be unique'() {
            $mol_assert_unique([1], [2], [3]);
        },
        'two must be alike'() {
            $mol_assert_equal([3], [3]);
        },
        'three must be alike'() {
            $mol_assert_equal([3], [3], [3]);
        },
        'two object must be alike'() {
            $mol_assert_equal({ a: 1 }, { a: 1 });
        },
        'three object must be alike'() {
            $mol_assert_equal({ a: 1 }, { a: 1 }, { a: 1 });
        },
    });
})($ || ($ = {}));

;
"use strict";
/** @jsx $mol_jsx */
/** @jsxFrag $mol_jsx_frag */
var $;
(function ($) {
    $mol_test({
        'Make empty div'() {
            $mol_assert_equal(($mol_jsx("div", null)).outerHTML, '<div></div>');
        },
        'Define native field'() {
            const dom = $mol_jsx("input", { value: '123' });
            $mol_assert_equal(dom.outerHTML, '<input value="123">');
            $mol_assert_equal(dom.value, '123');
        },
        'Define classes'() {
            const dom = $mol_jsx("div", { class: 'foo bar' });
            $mol_assert_equal(dom.outerHTML, '<div class="foo bar"></div>');
        },
        'Define styles'() {
            const dom = $mol_jsx("div", { style: { color: 'red' } });
            $mol_assert_equal(dom.outerHTML, '<div style="color: red;"></div>');
        },
        'Define dataset'() {
            const dom = $mol_jsx("div", { dataset: { foo: 'bar' } });
            $mol_assert_equal(dom.outerHTML, '<div data-foo="bar"></div>');
        },
        'Define attributes'() {
            const dom = $mol_jsx("div", { lang: "ru", hidden: true });
            $mol_assert_equal(dom.outerHTML, '<div lang="ru" hidden=""></div>');
        },
        'Define child nodes'() {
            const dom = $mol_jsx("div", null,
                "hello",
                $mol_jsx("strong", null, "world"),
                "!");
            $mol_assert_equal(dom.outerHTML, '<div>hello<strong>world</strong>!</div>');
        },
        'Make fragment'() {
            const dom = $mol_jsx($mol_jsx_frag, null,
                $mol_jsx("br", null),
                $mol_jsx("hr", null));
            $mol_assert_equal($mol_dom_serialize(dom), '<br xmlns="http://www.w3.org/1999/xhtml" /><hr xmlns="http://www.w3.org/1999/xhtml" />');
        },
        'Spread fragment'() {
            const dom = $mol_jsx("div", null,
                $mol_jsx($mol_jsx_frag, null,
                    $mol_jsx("br", null),
                    $mol_jsx("hr", null)));
            $mol_assert_equal(dom.outerHTML, '<div><br><hr></div>');
        },
        'Function as component'() {
            const Button = (props, target) => {
                return $mol_jsx("button", { title: props.hint }, target());
            };
            const dom = $mol_jsx(Button, { id: "foo", hint: "click me" }, () => 'hey!');
            $mol_assert_equal(dom.outerHTML, '<button id="foo" title="click me" class="Button">hey!</button>');
        },
        'Nested guid generation'() {
            const Foo = () => {
                return $mol_jsx("div", null,
                    $mol_jsx(Bar, { id: "bar" },
                        $mol_jsx("img", { id: "icon" })));
            };
            const Bar = (props, icon) => {
                return $mol_jsx("span", null,
                    icon,
                    $mol_jsx("i", { id: "label" }));
            };
            const dom = $mol_jsx(Foo, { id: "foo" });
            $mol_assert_equal(dom.outerHTML, '<div id="foo" class="Foo"><span id="foo/bar" class="Foo_bar Bar"><img id="foo/icon" class="Foo_icon"><i id="foo/bar/label" class="Foo_bar_label Bar_label"></i></span></div>');
        },
        'Fail on non unique ids'() {
            const App = () => {
                return $mol_jsx("div", null,
                    $mol_jsx("span", { id: "bar" }),
                    $mol_jsx("span", { id: "bar" }));
            };
            $mol_assert_fail(() => $mol_jsx(App, { id: "foo" }), 'JSX already has tag with id "foo/bar"');
        },
        'Owner based guid generationn'() {
            const Foo = () => {
                return $mol_jsx("div", null,
                    $mol_jsx(Bar, { id: "middle", icon: () => $mol_jsx("img", { id: "icon" }) }));
            };
            const Bar = (props) => {
                return $mol_jsx("span", null, props.icon());
            };
            const dom = $mol_jsx(Foo, { id: "app" });
            $mol_assert_equal(dom.outerHTML, '<div id="app" class="Foo"><span id="app/middle" class="Foo_middle Bar"><img id="app/icon" class="Foo_icon"></span></div>');
        },
        'Fail on same ids from different caller'() {
            const Foo = () => {
                return $mol_jsx("div", null,
                    $mol_jsx("img", { id: "icon" }),
                    $mol_jsx(Bar, { id: "bar", icon: () => $mol_jsx("img", { id: "icon" }) }));
            };
            const Bar = (props) => {
                return $mol_jsx("span", null, props.icon());
            };
            $mol_assert_fail(() => $mol_jsx(Foo, { id: "foo" }), 'JSX already has tag with id "foo/icon"');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'get'() {
            const proxy = $mol_delegate({}, () => ({ foo: 777 }));
            $mol_assert_equal(proxy.foo, 777);
        },
        'has'() {
            const proxy = $mol_delegate({}, () => ({ foo: 777 }));
            $mol_assert_equal('foo' in proxy, true);
        },
        'set'() {
            const target = { foo: 777 };
            const proxy = $mol_delegate({}, () => target);
            proxy.foo = 123;
            $mol_assert_equal(target.foo, 123);
        },
        'getOwnPropertyDescriptor'() {
            const proxy = $mol_delegate({}, () => ({ foo: 777 }));
            $mol_assert_like(Object.getOwnPropertyDescriptor(proxy, 'foo'), {
                value: 777,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        },
        'ownKeys'() {
            const proxy = $mol_delegate({}, () => ({ foo: 777, [Symbol.toStringTag]: 'bar' }));
            $mol_assert_like(Reflect.ownKeys(proxy), ['foo', Symbol.toStringTag]);
        },
        'getPrototypeOf'() {
            class Foo {
            }
            const proxy = $mol_delegate({}, () => new Foo);
            $mol_assert_equal(Object.getPrototypeOf(proxy), Foo.prototype);
        },
        'setPrototypeOf'() {
            class Foo {
            }
            const target = {};
            const proxy = $mol_delegate({}, () => target);
            Object.setPrototypeOf(proxy, Foo.prototype);
            $mol_assert_equal(Object.getPrototypeOf(target), Foo.prototype);
        },
        'instanceof'() {
            class Foo {
            }
            const proxy = $mol_delegate({}, () => new Foo);
            $mol_assert_ok(proxy instanceof Foo);
            $mol_assert_ok(proxy instanceof $mol_delegate);
        },
        'autobind'() {
            class Foo {
            }
            const proxy = $mol_delegate({}, () => new Foo);
            $mol_assert_ok(proxy instanceof Foo);
            $mol_assert_ok(proxy instanceof $mol_delegate);
        },
    });
})($ || ($ = {}));

;
"use strict";

;
"use strict";

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        $.$mol_log3_come = () => { };
        $.$mol_log3_done = () => { };
        $.$mol_log3_fail = () => { };
        $.$mol_log3_warn = () => { };
        $.$mol_log3_rise = () => { };
        $.$mol_log3_area = () => () => { };
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'FQN of anon function'($) {
            const $$ = Object.assign($, { $mol_func_name_test: (() => () => { })() });
            $mol_assert_equal($$.$mol_func_name_test.name, '');
            $mol_assert_equal($$.$mol_func_name($$.$mol_func_name_test), '$mol_func_name_test');
            $mol_assert_equal($$.$mol_func_name_test.name, '$mol_func_name_test');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'init with overload'() {
            class X extends $mol_object {
                foo() {
                    return 1;
                }
            }
            var x = X.make({
                foo: () => 2,
            });
            $mol_assert_equal(x.foo(), 2);
        },
        'Context in instance inherits from class'($) {
            const custom = $.$mol_ambient({});
            class X extends $.$mol_object {
                static $ = custom;
            }
            $mol_assert_equal(new X().$, custom);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'Collect deps'() {
            const pub1 = new $mol_wire_pub;
            const pub2 = new $mol_wire_pub;
            const sub = new $mol_wire_pub_sub;
            const bu1 = sub.track_on();
            try {
                pub1.promote();
                pub2.promote();
                pub2.promote();
            }
            finally {
                sub.track_cut();
                sub.track_off(bu1);
            }
            pub1.emit();
            pub2.emit();
            $mol_assert_like(sub.pub_list, [pub1, pub2, pub2]);
            const bu2 = sub.track_on();
            try {
                pub1.promote();
                pub1.promote();
                pub2.promote();
            }
            finally {
                sub.track_cut();
                sub.track_off(bu2);
            }
            pub1.emit();
            pub2.emit();
            $mol_assert_like(sub.pub_list, [pub1, pub1, pub2]);
        },
        'cyclic detection'($) {
            const sub1 = new $mol_wire_pub_sub;
            const sub2 = new $mol_wire_pub_sub;
            const bu1 = sub1.track_on();
            try {
                const bu2 = sub2.track_on();
                try {
                    $mol_assert_fail(() => sub1.promote(), 'Circular subscription');
                }
                finally {
                    sub2.track_cut();
                    sub2.track_off(bu2);
                }
            }
            finally {
                sub1.track_cut();
                sub1.track_off(bu1);
            }
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    /// @todo right orderinng
    $.$mol_after_mock_queue = [];
    function $mol_after_mock_warp() {
        const queue = $.$mol_after_mock_queue.splice(0);
        for (const task of queue)
            task();
    }
    $.$mol_after_mock_warp = $mol_after_mock_warp;
    class $mol_after_mock_commmon extends $mol_object2 {
        task;
        promise = Promise.resolve();
        cancelled = false;
        id;
        constructor(task) {
            super();
            this.task = task;
            $.$mol_after_mock_queue.push(task);
        }
        destructor() {
            const index = $.$mol_after_mock_queue.indexOf(this.task);
            if (index >= 0)
                $.$mol_after_mock_queue.splice(index, 1);
        }
    }
    $.$mol_after_mock_commmon = $mol_after_mock_commmon;
    class $mol_after_mock_timeout extends $mol_after_mock_commmon {
        delay;
        constructor(delay, task) {
            super(task);
            this.delay = delay;
        }
    }
    $.$mol_after_mock_timeout = $mol_after_mock_timeout;
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        $.$mol_after_tick = $mol_after_mock_commmon;
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Sync execution'() {
            class Sync extends $mol_object2 {
                static calc(a, b) {
                    return a + b;
                }
            }
            __decorate([
                $mol_wire_method
            ], Sync, "calc", null);
            $mol_assert_equal(Sync.calc(1, 2), 3);
        },
        async 'async <=> sync'() {
            class SyncAsync extends $mol_object2 {
                static async val(a) {
                    return a;
                }
                static sum(a, b) {
                    const syn = $mol_wire_sync(this);
                    return syn.val(a) + syn.val(b);
                }
                static async calc(a, b) {
                    return 5 + await $mol_wire_async(this).sum(a, b);
                }
            }
            $mol_assert_equal(await SyncAsync.calc(1, 2), 8);
        },
        async 'Idempotence control'() {
            class Idempotence extends $mol_object2 {
                static logs_idemp = 0;
                static logs_unidemp = 0;
                static log_idemp() {
                    this.logs_idemp += 1;
                }
                static log_unidemp() {
                    this.logs_unidemp += 1;
                }
                static async val(a) {
                    return a;
                }
                static sum(a, b) {
                    this.log_idemp();
                    this.log_unidemp();
                    const syn = $mol_wire_sync(this);
                    return syn.val(a) + syn.val(b);
                }
                static async calc(a, b) {
                    return 5 + await $mol_wire_async(this).sum(a, b);
                }
            }
            __decorate([
                $mol_wire_method
            ], Idempotence, "log_idemp", null);
            $mol_assert_equal(await Idempotence.calc(1, 2), 8);
            $mol_assert_equal(Idempotence.logs_idemp, 1);
            $mol_assert_equal(Idempotence.logs_unidemp, 3);
        },
        async 'Error handling'() {
            class Handle extends $mol_object2 {
                static async sum(a, b) {
                    $mol_fail(new Error('test error ' + (a + b)));
                }
                static check() {
                    try {
                        return $mol_wire_sync(Handle).sum(1, 2);
                    }
                    catch (error) {
                        if ($mol_promise_like(error))
                            $mol_fail_hidden(error);
                        $mol_assert_equal(error.message, 'test error 3');
                    }
                }
            }
            await $mol_wire_async(Handle).check();
        },
    });
})($ || ($ = {}));

;
"use strict";

;
"use strict";
var $;
(function ($) {
    /** Lazy computed lists with native Array interface. $mol_range2_array is mutable but all derived ranges are immutable. */
    function $mol_range2(item = index => index, size = () => Number.POSITIVE_INFINITY) {
        const source = typeof item === 'function' ? new $mol_range2_array() : item;
        if (typeof item !== 'function') {
            item = index => source[index];
            size = () => source.length;
        }
        return new Proxy(source, {
            get(target, field) {
                if (typeof field === 'string') {
                    if (field === 'length')
                        return size();
                    const index = Number(field);
                    if (index < 0)
                        return undefined;
                    if (index >= size())
                        return undefined;
                    if (index === Math.trunc(index))
                        return item(index);
                }
                return $mol_range2_array.prototype[field];
            },
            set(target, field) {
                return $mol_fail(new TypeError(`Lazy range is read only (trying to set field ${JSON.stringify(field)})`));
            },
            ownKeys(target) {
                return [...Array(size())].map((v, i) => String(i)).concat('length');
            },
            getOwnPropertyDescriptor(target, field) {
                if (field === "length")
                    return {
                        value: size(),
                        writable: true,
                        enumerable: false,
                        configurable: false,
                    };
                const index = Number(field);
                if (index === Math.trunc(index))
                    return {
                        get: () => this.get(target, field, this),
                        enumerable: true,
                        configurable: true,
                    };
                return Object.getOwnPropertyDescriptor(target, field);
            }
        });
    }
    $.$mol_range2 = $mol_range2;
    class $mol_range2_array extends Array {
        // Lazy
        concat(...tail) {
            if (tail.length === 0)
                return this;
            if (tail.length > 1) {
                let list = this;
                for (let item of tail)
                    list = list.concat(item);
                return list;
            }
            return $mol_range2(index => index < this.length ? this[index] : tail[0][index - this.length], () => this.length + tail[0].length);
        }
        // Lazy
        filter(check, context) {
            const filtered = [];
            let cursor = -1;
            return $mol_range2(index => {
                while (cursor < this.length && index >= filtered.length - 1) {
                    const val = this[++cursor];
                    if (check(val, cursor, this))
                        filtered.push(val);
                }
                return filtered[index];
            }, () => cursor < this.length ? Number.POSITIVE_INFINITY : filtered.length);
        }
        // Diligent
        forEach(proceed, context) {
            for (let [key, value] of this.entries())
                proceed.call(context, value, key, this);
        }
        // Lazy
        map(proceed, context) {
            return $mol_range2(index => proceed.call(context, this[index], index, this), () => this.length);
        }
        // Diligent
        reduce(merge, result) {
            let index = 0;
            if (arguments.length === 1) {
                result = this[index++];
            }
            for (; index < this.length; ++index) {
                result = merge(result, this[index], index, this);
            }
            return result;
        }
        // Lazy
        toReversed() {
            return $mol_range2(index => this[this.length - 1 - index], () => this.length);
        }
        // Lazy
        slice(from = 0, to = this.length) {
            return $mol_range2(index => this[from + index], () => Math.min(to, this.length) - from);
        }
        // Lazy
        some(check, context) {
            for (let index = 0; index < this.length; ++index) {
                if (check.call(context, this[index], index, this))
                    return true;
            }
            return false;
        }
        every(check, context) {
            for (let index = 0; index < this.length; ++index) {
                if (!check.call(context, this[index], index, this))
                    return false;
            }
            return true;
        }
        reverse() {
            return $mol_fail(new TypeError(`Mutable reverse is forbidden. Use toReversed instead.`));
        }
        sort() {
            return $mol_fail(new TypeError(`Mutable sort is forbidden. Use toSorted instead.`));
        }
        indexOf(needle) {
            return this.findIndex(item => item === needle);
        }
        [Symbol.toPrimitive]() {
            return $mol_guid();
        }
    }
    $.$mol_range2_array = $mol_range2_array;
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'lazy calls'() {
            let calls = 0;
            const list = $mol_range2(index => (++calls, index), () => 10);
            $mol_assert_equal(true, list instanceof Array);
            $mol_assert_equal(list.length, 10);
            $mol_assert_equal(list[-1], undefined);
            $mol_assert_equal(list[0], 0);
            $mol_assert_equal(list[9], 9);
            $mol_assert_equal(list[9.5], undefined);
            $mol_assert_equal(list[10], undefined);
            $mol_assert_equal(calls, 2);
        },
        'infinity list'() {
            let calls = 0;
            const list = $mol_range2(index => (++calls, index));
            $mol_assert_equal(list.length, Number.POSITIVE_INFINITY);
            $mol_assert_equal(list[0], 0);
            $mol_assert_equal(list[4], 4);
            $mol_assert_equal(list[Number.MAX_SAFE_INTEGER], Number.MAX_SAFE_INTEGER);
            $mol_assert_equal(list[Number.POSITIVE_INFINITY], undefined);
            $mol_assert_equal(calls, 3);
        },
        'stringify'() {
            const list = $mol_range2(i => i, () => 5);
            $mol_assert_equal(list.toString(), '0,1,2,3,4');
            $mol_assert_equal(list.join(';'), '0;1;2;3;4');
        },
        'for-of'() {
            let log = '';
            for (let i of $mol_range2(i => i + 1, () => 5)) {
                log += i;
            }
            $mol_assert_equal(log, '12345');
        },
        'for-in'() {
            let log = '';
            for (let i in $mol_range2(i => i, () => 5)) {
                log += i;
            }
            $mol_assert_equal(log, '01234');
        },
        'forEach'() {
            let log = '';
            $mol_range2(i => i, () => 5).forEach(i => log += i);
            $mol_assert_equal(log, '01234');
        },
        'reduce'() {
            let calls = 0;
            const list = $mol_range2().slice(1, 6);
            $mol_assert_equal(list.reduce((s, v) => s + v), 15);
            $mol_assert_equal(list.reduce((s, v) => s + v, 5), 20);
        },
        'lazy concat'() {
            let calls1 = 0;
            let calls2 = 0;
            const list = $mol_range2(index => (++calls1, index), () => 5).concat([0, 1, 2, 3, 4], $mol_range2(index => (++calls2, index), () => 5));
            $mol_assert_equal(true, list instanceof Array);
            $mol_assert_equal(list.length, 15);
            $mol_assert_equal(list[0], 0);
            $mol_assert_equal(list[4], 4);
            $mol_assert_equal(list[5], 0);
            $mol_assert_equal(list[9], 4);
            $mol_assert_equal(list[10], 0);
            $mol_assert_equal(list[14], 4);
            $mol_assert_equal(list[15], undefined);
            $mol_assert_equal(calls1, 2);
            $mol_assert_equal(calls2, 2);
        },
        'lazy filter'() {
            let calls = 0;
            const list = $mol_range2(index => (++calls, index), () => 15).filter(v => v % 2).slice(0, 3);
            $mol_assert_equal(true, list instanceof Array);
            $mol_assert_equal(list.length, 3);
            $mol_assert_equal(list[0], 1);
            $mol_assert_equal(list[2], 5);
            $mol_assert_equal(list[3], undefined);
            $mol_assert_equal(calls, 8);
        },
        'lazy reverse'() {
            let calls = 0;
            const list = $mol_range2(index => (++calls, index), () => 10).toReversed().slice(0, 3);
            $mol_assert_equal(true, list instanceof Array);
            $mol_assert_equal(list.length, 3);
            $mol_assert_equal(list[0], 9);
            $mol_assert_equal(list[2], 7);
            $mol_assert_equal(list[3], undefined);
            $mol_assert_equal(calls, 2);
        },
        'lazy map'() {
            let calls1 = 0;
            let calls2 = 0;
            const source = $mol_range2(index => (++calls1, index), () => 5);
            const target = source.map((item, index, self) => {
                ++calls2;
                $mol_assert_equal(source, self);
                return index + 10;
            }, () => 5);
            $mol_assert_equal(true, target instanceof Array);
            $mol_assert_equal(target.length, 5);
            $mol_assert_equal(target[0], 10);
            $mol_assert_equal(target[4], 14);
            $mol_assert_equal(target[5], undefined);
            $mol_assert_equal(calls1, 2);
            $mol_assert_equal(calls2, 2);
        },
        'lazy slice'() {
            let calls = 0;
            const list = $mol_range2(index => (++calls, index), () => 10).slice(3, 7);
            $mol_assert_equal(true, list instanceof Array);
            $mol_assert_equal(list.length, 4);
            $mol_assert_equal(list[0], 3);
            $mol_assert_equal(list[3], 6);
            $mol_assert_equal(list[4], undefined);
            $mol_assert_equal(calls, 2);
        },
        'lazy some'() {
            let calls = 0;
            $mol_assert_equal(true, $mol_range2(index => (++calls, index), () => 5).some(v => v >= 2));
            $mol_assert_equal(calls, 3);
            $mol_assert_equal(false, $mol_range2(i => i, () => 0).some(v => true));
            $mol_assert_equal(true, $mol_range2(i => i).some(v => v > 5));
        },
        'lazy every'() {
            let calls = 0;
            $mol_assert_equal(false, $mol_range2(index => (++calls, index), () => 5).every(v => v < 2));
            $mol_assert_equal(calls, 3);
            $mol_assert_equal(true, $mol_range2(i => i, () => 0).every(v => false));
            $mol_assert_equal(false, $mol_range2(i => i).every(v => v < 5));
        },
        'lazyfy'() {
            let calls = 0;
            const list = $mol_range2([0, 1, 2, 3, 4, 5]).map(i => (++calls, i + 10)).slice(2);
            $mol_assert_equal(true, list instanceof Array);
            $mol_assert_equal(list.length, 4);
            $mol_assert_equal(calls, 0);
            $mol_assert_equal(list[0], 12);
            $mol_assert_equal(list[3], 15);
            $mol_assert_equal(list[4], undefined);
            $mol_assert_equal(calls, 2);
        },
        'prevent modification'() {
            const list = $mol_range2(i => i, () => 5);
            $mol_assert_fail(() => list.push(4), TypeError);
            $mol_assert_fail(() => list.pop(), TypeError);
            $mol_assert_fail(() => list.unshift(4), TypeError);
            $mol_assert_fail(() => list.shift(), TypeError);
            $mol_assert_fail(() => list.splice(1, 2), TypeError);
            $mol_assert_fail(() => list[1] = 2, TypeError);
            $mol_assert_fail(() => list.reverse(), TypeError);
            $mol_assert_fail(() => list.sort(), TypeError);
            $mol_assert_equal(list.toString(), '0,1,2,3,4');
        }
    });
})($ || ($ = {}));

;
"use strict";
/** @jsx $mol_jsx */
var $;
(function ($) {
    $mol_test({
        'nulls & undefineds'() {
            $mol_assert_ok($mol_compare_deep(null, null));
            $mol_assert_ok($mol_compare_deep(undefined, undefined));
            $mol_assert_not($mol_compare_deep(undefined, null));
            $mol_assert_not($mol_compare_deep({}, null));
        },
        'number'() {
            $mol_assert_ok($mol_compare_deep(1, 1));
            $mol_assert_ok($mol_compare_deep(Number.NaN, Number.NaN));
            $mol_assert_not($mol_compare_deep(1, 2));
            $mol_assert_ok($mol_compare_deep(Object(1), Object(1)));
            $mol_assert_not($mol_compare_deep(Object(1), Object(2)));
        },
        'POJO'() {
            $mol_assert_ok($mol_compare_deep({}, {}));
            $mol_assert_not($mol_compare_deep({ a: 1 }, { b: 2 }));
            $mol_assert_not($mol_compare_deep({ a: 1 }, { a: 2 }));
            $mol_assert_not($mol_compare_deep({}, { a: undefined }));
            $mol_assert_not($mol_compare_deep({ a: 1, b: 2 }, { b: 2, a: 1 }));
            $mol_assert_ok($mol_compare_deep({ a: { b: 1 } }, { a: { b: 1 } }));
            $mol_assert_ok($mol_compare_deep(Object.create(null), Object.create(null)));
        },
        'Array'() {
            $mol_assert_ok($mol_compare_deep([], []));
            $mol_assert_ok($mol_compare_deep([1, [2]], [1, [2]]));
            $mol_assert_not($mol_compare_deep([1, 2], [1, 3]));
            $mol_assert_not($mol_compare_deep([1, 2,], [1, 3, undefined]));
            $mol_assert_not($mol_compare_deep($mol_range2().slice(0, 0), new Array()));
            $mol_assert_not($mol_compare_deep($mol_range2(), $mol_range2()));
        },
        'Non POJO are different'() {
            class Thing extends Object {
            }
            $mol_assert_not($mol_compare_deep(new Thing, new Thing));
            $mol_assert_not($mol_compare_deep(() => 1, () => 1));
            $mol_assert_not($mol_compare_deep(new RangeError('Test error'), new RangeError('Test error')));
        },
        'POJO with symbols'() {
            const sym = Symbol();
            $mol_assert_ok($mol_compare_deep({ [sym]: true }, { [sym]: true }));
            $mol_assert_not($mol_compare_deep({ [Symbol()]: true }, { [Symbol()]: true }));
        },
        'same POJOs with cyclic reference'() {
            const a = { foo: {} };
            a['self'] = a;
            const b = { foo: {} };
            b['self'] = b;
            $mol_assert_ok($mol_compare_deep(a, b));
        },
        'same POJOs with cyclic reference with cache warmup'() {
            const obj1 = { test: 1, obj3: null };
            const obj1_copy = { test: 1, obj3: null };
            const obj2 = { test: 2, obj1 };
            const obj2_copy = { test: 2, obj1: obj1_copy };
            const obj3 = { test: 3, obj2 };
            const obj3_copy = { test: 3, obj2: obj2_copy };
            obj1.obj3 = obj3;
            obj1_copy.obj3 = obj3_copy;
            // warmup cache
            $mol_assert_not($mol_compare_deep(obj1, {}));
            $mol_assert_not($mol_compare_deep(obj2, {}));
            $mol_assert_not($mol_compare_deep(obj3, {}));
            $mol_assert_ok($mol_compare_deep(obj3, obj3_copy));
        },
        'Date'() {
            $mol_assert_ok($mol_compare_deep(new Date(12345), new Date(12345)));
            $mol_assert_not($mol_compare_deep(new Date(12345), new Date(12346)));
        },
        'RegExp'() {
            $mol_assert_ok($mol_compare_deep(/\x22/mig, /\x22/mig));
            $mol_assert_not($mol_compare_deep(/\x22/mig, /\x21/mig));
            $mol_assert_not($mol_compare_deep(/\x22/mig, /\x22/mg));
        },
        'Error'() {
            $mol_assert_not($mol_compare_deep(new Error('xxx'), new Error('xxx')));
            const fail = (message) => new Error(message);
            $mol_assert_ok($mol_compare_deep(...['xxx', 'xxx'].map(msg => new Error(msg))));
            $mol_assert_not($mol_compare_deep(...['xxx', 'yyy'].map(msg => new Error(msg))));
        },
        'Map'() {
            $mol_assert_ok($mol_compare_deep(new Map, new Map));
            $mol_assert_ok($mol_compare_deep(new Map([[1, [2]]]), new Map([[1, [2]]])));
            $mol_assert_ok($mol_compare_deep(new Map([[[1], 2]]), new Map([[[1], 2]])));
            $mol_assert_not($mol_compare_deep(new Map([[1, 2]]), new Map([[1, 3]])));
            $mol_assert_not($mol_compare_deep(new Map([[[1], 2]]), new Map([[[3], 2]])));
        },
        'Set'() {
            $mol_assert_ok($mol_compare_deep(new Set, new Set));
            $mol_assert_ok($mol_compare_deep(new Set([1, [2]]), new Set([1, [2]])));
            $mol_assert_not($mol_compare_deep(new Set([1]), new Set([2])));
        },
        'Uint8Array'() {
            $mol_assert_ok($mol_compare_deep(new Uint8Array, new Uint8Array));
            $mol_assert_ok($mol_compare_deep(new Uint8Array([0]), new Uint8Array([0])));
            $mol_assert_not($mol_compare_deep(new Uint8Array([0]), new Uint8Array([1])));
        },
        'DataView'() {
            $mol_assert_ok($mol_compare_deep(new DataView(new Uint8Array().buffer), new DataView(new Uint8Array().buffer)));
            $mol_assert_ok($mol_compare_deep(new DataView(new Uint8Array([0]).buffer), new DataView(new Uint8Array([0]).buffer)));
            $mol_assert_not($mol_compare_deep(new DataView(new Uint8Array([0]).buffer), new DataView(new Uint8Array([1]).buffer)));
        },
        'Serializale'() {
            class User {
                name;
                rand;
                constructor(name, rand = Math.random()) {
                    this.name = name;
                    this.rand = rand;
                }
                [Symbol.toPrimitive](mode) {
                    return this.name;
                }
            }
            $mol_assert_ok($mol_compare_deep(new User('Jin'), new User('Jin')));
            $mol_assert_not($mol_compare_deep(new User('Jin'), new User('John')));
        },
        'Iterable'() {
            $mol_assert_ok($mol_compare_deep(new URLSearchParams({ foo: 'bar' }), new URLSearchParams({ foo: 'bar' })));
            $mol_assert_not($mol_compare_deep(new URLSearchParams({ foo: 'xxx' }), new URLSearchParams({ foo: 'yyy' })));
            $mol_assert_not($mol_compare_deep(new URLSearchParams({ foo: 'xxx', bar: 'yyy' }), new URLSearchParams({ bar: 'yyy', foo: 'xxx' })));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        $.$mol_after_timeout = $mol_after_mock_timeout;
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'test types'($) {
            class A {
                static a() {
                    return '';
                }
                static b() {
                    return $mol_wire_async(this).a();
                }
            }
        },
        async 'Latest method calls wins'($) {
            class NameLogger extends $mol_object2 {
                static $ = $;
                static first = [];
                static last = [];
                static send(next) {
                    $mol_wire_sync(this.first).push(next);
                    $$.$mol_wait_timeout(0);
                    this.last.push(next);
                }
            }
            const name = $mol_wire_async(NameLogger).send;
            name('john');
            const promise = name('jin');
            $.$mol_after_mock_warp();
            await promise;
            $mol_assert_equal(NameLogger.first, ['john', 'jin']);
            $mol_assert_equal(NameLogger.last, ['jin']);
        },
        async 'Latest function calls wins'($) {
            const first = [];
            const last = [];
            function send_name(next) {
                $mol_wire_sync(first).push(next);
                $$.$mol_wait_timeout(0);
                last.push(next);
            }
            const name = $mol_wire_async(send_name);
            name('john');
            const promise = name('jin');
            $.$mol_after_mock_warp();
            await promise;
            $mol_assert_equal(first, ['john', 'jin']);
            $mol_assert_equal(last, ['jin']);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'test types'($) {
            class A {
                static a() {
                    return Promise.resolve('');
                }
                static b() {
                    return $mol_wire_sync(this).a();
                }
            }
        },
        async 'test method from host'($) {
            let count = 0;
            class A {
                static a() {
                    return $mol_wire_sync(this).b();
                }
                static b() { return Promise.resolve(++count); }
            }
            $mol_assert_equal(await $mol_wire_async(A).a(), 1, count);
        },
        async 'test function'($) {
            let count = 0;
            class A {
                static a() {
                    return $mol_wire_sync(this.b)();
                }
                static b() { return Promise.resolve(++count); }
            }
            $mol_assert_equal(await $mol_wire_async(A).a(), 1, count);
        },
        async 'test construct itself'($) {
            class A {
                static instances = [];
                static a() {
                    const a = new ($mol_wire_sync(A))();
                    this.instances.push(a);
                    $mol_wire_sync(this).b();
                }
                static b() { return Promise.resolve(); }
            }
            await $mol_wire_async(A).a();
            $mol_assert_equal(A.instances.length, 2);
            $mol_assert_equal(A.instances[0] instanceof A, true);
            $mol_assert_equal(A.instances[0], A.instances[1]);
        }
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        $.$mol_after_work = $mol_after_mock_timeout;
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test_mocks.push($ => {
            $.$mol_wait_timeout = function $mol_wait_timeout_mock(timeout) { };
            $.$mol_wait_timeout_async = async function $mol_wait_timeout_async_mock(timeout) { };
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test_mocks.push($ => {
            $.$mol_wait_rest = function $mol_wait_rest_mock() { };
            $.$mol_wait_rest_async = async function $mol_wait_rest_async_mock() { };
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        // https://github.com/nin-jin/slides/tree/master/reactivity#component-states
        'Cached channel'($) {
            class App extends $mol_object2 {
                static $ = $;
                static value(next = 1) {
                    return next + 1;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "value", null);
            $mol_assert_equal(App.value(), 2);
            App.value(2);
            $mol_assert_equal(App.value(), 3);
        },
        'Read Pushed'($) {
            class App extends $mol_object2 {
                static $ = $;
                static value(next = 0) {
                    return next;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "value", null);
            $mol_assert_equal(App.value(1), 1);
            $mol_assert_equal(App.value(), 1);
        },
        'Mem overrides mem'($) {
            class Base extends $mol_object2 {
                static $ = $;
                static value(next = 1) {
                    return next + 1;
                }
            }
            __decorate([
                $mol_wire_solo
            ], Base, "value", null);
            class Middle extends Base {
                static value(next) {
                    return super.value(next) + 1;
                }
            }
            __decorate([
                $mol_wire_solo
            ], Middle, "value", null);
            class App extends Middle {
                static value(next) {
                    return super.value(next) * 3;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "value", null);
            $mol_assert_equal(App.value(), 9);
            $mol_assert_equal(App.value(5), 21);
            $mol_assert_equal(App.value(), 21);
        },
        // https://github.com/nin-jin/slides/tree/master/reactivity#wish-consistency
        'Auto recalculation of cached values'($) {
            class App extends $mol_object2 {
                static $ = $;
                static xxx(next) {
                    return next || 1;
                }
                static yyy() {
                    return this.xxx() + 1;
                }
                static zzz() {
                    return this.yyy() + 1;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "xxx", null);
            __decorate([
                $mol_wire_solo
            ], App, "yyy", null);
            __decorate([
                $mol_wire_solo
            ], App, "zzz", null);
            $mol_assert_equal(App.yyy(), 2);
            $mol_assert_equal(App.zzz(), 3);
            App.xxx(5);
            $mol_assert_equal(App.zzz(), 7);
        },
        // https://github.com/nin-jin/slides/tree/master/reactivity#wish-reasonability
        'Skip recalculation when actually no dependency changes'($) {
            const log = [];
            class App extends $mol_object2 {
                static $ = $;
                static xxx(next) {
                    log.push('xxx');
                    return next || 1;
                }
                static yyy() {
                    log.push('yyy');
                    return [Math.sign(this.xxx())];
                }
                static zzz() {
                    log.push('zzz');
                    return this.yyy()[0] + 1;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "xxx", null);
            __decorate([
                $mol_wire_solo
            ], App, "yyy", null);
            __decorate([
                $mol_wire_solo
            ], App, "zzz", null);
            App.zzz();
            $mol_assert_like(log, ['zzz', 'yyy', 'xxx']);
            App.xxx(5);
            $mol_assert_like(log, ['zzz', 'yyy', 'xxx', 'xxx']);
            App.zzz();
            $mol_assert_like(log, ['zzz', 'yyy', 'xxx', 'xxx', 'yyy']);
        },
        // https://github.com/nin-jin/slides/tree/master/reactivity#flow-auto
        'Flow: Auto'($) {
            class App extends $mol_object2 {
                static get $() { return $; }
                static source(next = 1) { return next; }
                static condition(next = true) { return next; }
                static counter = 0;
                static result() {
                    const res = this.condition() ? this.source() : 0;
                    return res + this.counter++;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "source", null);
            __decorate([
                $mol_wire_solo
            ], App, "condition", null);
            __decorate([
                $mol_wire_solo
            ], App, "result", null);
            $mol_assert_equal(App.result(), 1);
            $mol_assert_equal(App.counter, 1);
            App.source(10);
            $mol_assert_equal(App.result(), 11);
            $mol_assert_equal(App.counter, 2);
            App.condition(false);
            $mol_assert_equal(App.result(), 2);
            $mol_assert_equal(App.counter, 3);
            $mol_wire_fiber.sync();
            $mol_assert_equal(App.source(), 1);
            App.source(20);
            $mol_assert_equal(App.result(), 2);
            $mol_assert_equal(App.counter, 3);
            App.condition(true);
            $mol_assert_equal(App.result(), 23);
            $mol_assert_equal(App.counter, 4);
        },
        // https://github.com/nin-jin/slides/tree/master/reactivity#dupes-equality
        'Dupes: Equality'($) {
            let counter = 0;
            class App extends $mol_object2 {
                static $ = $;
                static foo(next) {
                    return next ?? { numbs: [1] };
                }
                static bar() {
                    return { ...this.foo(), count: ++counter };
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "foo", null);
            __decorate([
                $mol_wire_solo
            ], App, "bar", null);
            $mol_assert_like(App.bar(), { numbs: [1], count: 1 });
            App.foo({ numbs: [1] });
            $mol_assert_like(App.bar(), { numbs: [1], count: 1 });
            App.foo({ numbs: [2] });
            $mol_assert_like(App.bar(), { numbs: [2], count: 2 });
        },
        // https://github.com/nin-jin/slides/tree/master/reactivity#cycle-fail
        'Cycle: Fail'($) {
            class App extends $mol_object2 {
                static $ = $;
                static foo() {
                    return this.bar() + 1;
                }
                static bar() {
                    return this.foo() + 1;
                }
                static test() {
                    $mol_assert_fail(() => App.foo(), 'Circular subscription');
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "foo", null);
            __decorate([
                $mol_wire_solo
            ], App, "bar", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        // https://github.com/nin-jin/slides/tree/master/reactivity#wish-stability
        // 'Update deps on push'( $ ) {
        // 	class App extends $mol_object2 {
        // 		static $ = $
        // 		@ $mol_wire_solo
        // 		static left( next = false ) {
        // 			return next
        // 		}
        // 		@ $mol_wire_solo
        // 		static right( next = false ) {
        // 			return next
        // 		}
        // 		@ $mol_wire_solo
        // 		static res( next?: boolean ) {
        // 			return this.left( next ) && this.right()
        // 		}
        // 	}
        // 	$mol_assert_equal( App.res(), false )
        // 	$mol_assert_equal( App.res( true ), false )
        // 	$mol_assert_equal( App.right( true ), true )
        // 	$mol_assert_equal( App.res(), true )
        // } ,
        // https://github.com/nin-jin/slides/tree/master/reactivity#wish-stability
        'Different order of pull and push'($) {
            class App extends $mol_object2 {
                static $ = $;
                static store(next = 0) {
                    return next;
                }
                static fast(next) {
                    return this.store(next);
                }
                static slow(next) {
                    if (next !== undefined)
                        this.slow(); // enforce pull before push
                    return this.store(next);
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "store", null);
            __decorate([
                $mol_wire_solo
            ], App, "fast", null);
            __decorate([
                $mol_wire_solo
            ], App, "slow", null);
            App.fast();
            $mol_assert_equal(App.slow(666), 666);
            $mol_assert_equal(App.fast(), App.slow(), 666);
            App.store(777);
            $mol_assert_equal(App.fast(), App.slow(), 777);
        },
        // https://github.com/nin-jin/slides/tree/master/reactivity#wish-stability
        'Actions inside invariant'($) {
            class App extends $mol_object2 {
                static $ = $;
                static count(next = 0) {
                    return next;
                }
                static count2() {
                    return this.count();
                }
                static res() {
                    const count = this.count2();
                    if (!count)
                        this.count(count + 1);
                    return count + 1;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "count", null);
            __decorate([
                $mol_wire_solo
            ], App, "count2", null);
            __decorate([
                $mol_wire_solo
            ], App, "res", null);
            $mol_assert_like(App.res(), 1);
            App.count(5);
            $mol_assert_like(App.res(), 6);
        },
        async 'Toggle with async'($) {
            class App extends $mol_object2 {
                static $ = $;
                static checked(next = false) {
                    $$.$mol_wait_timeout(0);
                    return next;
                }
                static toggle() {
                    const prev = this.checked();
                    $mol_assert_unique(this.checked(!prev), prev);
                    // $mol_assert_equal( this.checked() , prev )
                }
                static res() {
                    return this.checked();
                }
                static test() {
                    $mol_assert_equal(App.res(), false);
                    App.toggle();
                    $mol_assert_equal(App.res(), true);
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "checked", null);
            __decorate([
                $mol_wire_method
            ], App, "toggle", null);
            __decorate([
                $mol_wire_solo
            ], App, "res", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            await $mol_wire_async(App).test();
        },
        // // https://github.com/nin-jin/slides/tree/master/reactivity#wish-stability
        // 'Stable order of multiple root'( $ ) {
        // 	class App extends $mol_object2 {
        // 		static $ = $
        // 		static counter = 0
        // 		@ $mol_wire_solo
        // 		static left_trigger( next = 0 ) {
        // 			return next
        // 		}
        // 		@ $mol_wire_solo
        // 		static left_root() {
        // 			this.left_trigger()
        // 			return ++ this.counter
        // 		}
        // 		@ $mol_wire_solo
        // 		static right_trigger( next = 0 ) {
        // 			return next
        // 		}
        // 		@ $mol_wire_solo
        // 		static right_root() {
        // 			this.right_trigger()
        // 			return ++ this.counter
        // 		}
        // 	}
        // 	$mol_assert_equal( App.left_root(), 1 )
        // 	$mol_assert_equal( App.right_root(), 2 )
        // 	App.right_trigger( 1 )
        // 	App.left_trigger( 1 )
        // 	$mol_wire_fiber.sync()
        // 	$mol_assert_equal( App.right_root(), 4 )
        // 	$mol_assert_equal( App.left_root(), 3 )
        // } ,
        // https://github.com/nin-jin/slides/tree/master/reactivity#error-store
        'Restore after error'($) {
            class App extends $mol_object2 {
                static get $() { return $; }
                static condition(next = false) { return next; }
                static broken() {
                    if (this.condition()) {
                        $mol_fail(new Error('test error'));
                    }
                    return 1;
                }
                static result() {
                    return this.broken();
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "condition", null);
            __decorate([
                $mol_wire_solo
            ], App, "broken", null);
            __decorate([
                $mol_wire_solo
            ], App, "result", null);
            $mol_assert_equal(App.result(), 1);
            App.condition(true);
            $mol_assert_fail(() => App.result(), 'test error');
            App.condition(false);
            $mol_assert_equal(App.result(), 1);
        },
        async 'Wait for data'($) {
            class App extends $mol_object2 {
                static $ = $;
                static async source() {
                    return 'Jin';
                }
                static middle() {
                    return $mol_wire_sync(this).source();
                }
                static target() {
                    return this.middle();
                }
                static test() {
                    $mol_assert_equal(App.target(), 'Jin');
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "middle", null);
            __decorate([
                $mol_wire_solo
            ], App, "target", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            await $mol_wire_async(App).test();
        },
        'Auto destroy on long alone'($) {
            let destroyed = false;
            class App extends $mol_object2 {
                static $ = $;
                static showing(next = true) {
                    return next;
                }
                static details() {
                    return {
                        destructor() {
                            destroyed = true;
                        }
                    };
                }
                static render() {
                    return this.showing() ? this.details() : null;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "showing", null);
            __decorate([
                $mol_wire_solo
            ], App, "details", null);
            __decorate([
                $mol_wire_solo
            ], App, "render", null);
            const details = App.render();
            $mol_assert_ok(details);
            App.showing(false);
            $mol_assert_not(App.render());
            App.showing(true);
            $mol_assert_equal(App.render(), details);
            $mol_wire_fiber.sync();
            $mol_assert_not(destroyed);
            App.showing(false);
            $mol_wire_fiber.sync();
            $mol_assert_ok(destroyed);
            App.showing(true);
            $mol_assert_unique(App.render(), details);
        },
        // https://github.com/nin-jin/slides/tree/master/reactivity#wish-stability
        async 'Hold pubs while wait async task'($) {
            class App extends $mol_object2 {
                static $ = $;
                static counter = 0;
                static resets(next) {
                    return ($mol_wire_probe(() => this.resets()) ?? -1) + 1;
                }
                static async wait() { }
                static value() {
                    return ++this.counter;
                }
                static result() {
                    if (this.resets())
                        $mol_wire_sync(this).wait();
                    return this.value();
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "resets", null);
            __decorate([
                $mol_wire_solo
            ], App, "value", null);
            __decorate([
                $mol_wire_solo
            ], App, "result", null);
            $mol_assert_equal(App.result(), 1);
            App.resets(null);
            $mol_wire_fiber.sync();
            $mol_assert_equal(await $mol_wire_async(App).result(), 1);
        },
        'Owned value has js-path name'() {
            class App extends $mol_object2 {
                static title() {
                    return new $mol_object2;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "title", null);
            $mol_assert_equal(`${App.title()}`, 'App.title<>');
        },
        'Unsubscribe from temp pubs on complete'($) {
            class Random extends $mol_object2 {
                static $ = $;
                static seed() {
                    return Math.random();
                }
                static resets(next) {
                    return Math.random();
                }
                static value() {
                    this.resets();
                    return this.seed();
                }
            }
            __decorate([
                $mol_wire_method
            ], Random, "seed", null);
            __decorate([
                $mol_wire_solo
            ], Random, "resets", null);
            __decorate([
                $mol_wire_solo
            ], Random, "value", null);
            const first = Random.value();
            Random.resets(null);
            $mol_assert_unique(Random.value(), first);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        async 'Error caching'($) {
            const next_cached = 123;
            class Some extends $mol_object2 {
                static $ = $;
                static data(id, next) {
                    if (next)
                        return next;
                    setTimeout(() => {
                        $mol_wire_async(this).data(id, next_cached);
                    }, 10);
                    $mol_fail_hidden(new Promise(() => { }));
                }
                static run() {
                    return this.data('1');
                }
            }
            __decorate([
                $mol_wire_plex
            ], Some, "data", null);
            __decorate([
                $mol_wire_method
            ], Some, "run", null);
            const val = await $mol_wire_async(Some).run();
            $mol_assert_equal(val, next_cached);
        },
        'Memoize by single simple key'($) {
            class Team extends $mol_object2 {
                static $ = $;
                static user_name(user, next) {
                    return next ?? user;
                }
                static user_names() {
                    return [
                        this.user_name('jin'),
                        this.user_name('john'),
                    ];
                }
            }
            __decorate([
                $mol_wire_plex
            ], Team, "user_name", null);
            __decorate([
                $mol_wire_solo
            ], Team, "user_names", null);
            $mol_assert_like(Team.user_names(), ['jin', 'john']);
            Team.user_name('jin', 'JIN');
            $mol_assert_like(Team.user_names(), ['JIN', 'john']);
        },
        'Memoize by single complex key'($) {
            class Map extends $mol_object2 {
                static $ = $;
                static tile(pos) {
                    return new String(`/tile=${pos}`);
                }
                static test() {
                    $mol_assert_like(this.tile([0, 1]), new String('/tile=0,1'));
                    $mol_assert_equal(this.tile([0, 1]), this.tile([0, 1]));
                }
            }
            __decorate([
                $mol_wire_plex
            ], Map, "tile", null);
            __decorate([
                $mol_wire_method
            ], Map, "test", null);
            Map.test();
        },
        'Owned value has js-path name'() {
            class App extends $mol_object2 {
                static like(friend) {
                    return new $mol_object2;
                }
                static relation([friend, props]) {
                    return new $mol_object2;
                }
            }
            __decorate([
                $mol_wire_plex
            ], App, "like", null);
            __decorate([
                $mol_wire_plex
            ], App, "relation", null);
            $mol_assert_equal(`${App.like(123)}`, 'App.like<123>');
            $mol_assert_equal(`${App.relation([123, [456]])}`, 'App.relation<[123,[456]]>');
        },
        'Deep deps'($) {
            class Fib extends $mol_object2 {
                static $ = $;
                static sums = 0;
                static value(index, next) {
                    if (next)
                        return next;
                    if (index < 2)
                        return 1;
                    ++this.sums;
                    return this.value(index - 1) + this.value(index - 2);
                }
            }
            __decorate([
                $mol_wire_plex
            ], Fib, "value", null);
            $mol_assert_equal(Fib.value(4), 5);
            $mol_assert_equal(Fib.sums, 3);
            Fib.value(1, 2);
            $mol_assert_equal(Fib.value(4), 8);
            $mol_assert_equal(Fib.sums, 6);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Previous value'() {
            class Cache extends $mol_object2 {
                static store(next) {
                    if (!next)
                        return {};
                    return {
                        ...$mol_wire_probe(() => this.store()) ?? {},
                        ...next,
                    };
                }
            }
            __decorate([
                $mol_wire_solo
            ], Cache, "store", null);
            $mol_assert_like(Cache.store(), {});
            $mol_assert_like(Cache.store({ foo: 666 }), { foo: 666 });
            $mol_assert_like(Cache.store({ bar: 777 }), { foo: 666, bar: 777 });
        },
    });
})($ || ($ = {}));

;
"use strict";
/** @jsx $mol_jsx */
var $;
(function ($) {
    $mol_test({
        'Primitives'() {
            $mol_assert_equal($mol_key(null), 'null');
            $mol_assert_equal($mol_key(false), 'false');
            $mol_assert_equal($mol_key(true), 'true');
            $mol_assert_equal($mol_key(0), '0');
            $mol_assert_equal($mol_key(1n << 64n), '18446744073709551616n');
            $mol_assert_equal($mol_key(''), '""');
        },
        'Array & POJO'() {
            $mol_assert_equal($mol_key([null]), '[null]');
            $mol_assert_equal($mol_key({ foo: 0 }), '{"foo":0}');
            $mol_assert_equal($mol_key({ foo: [false] }), '{"foo":[false]}');
        },
        'Uint8Array'() {
            $mol_assert_equal($mol_key(new Uint8Array([1, 2])), 'Uint8Array([1,2])');
            $mol_assert_equal($mol_key([new Uint8Array([1, 2])]), '[Uint8Array([1,2])]');
            $mol_assert_equal($mol_key({ foo: new Uint8Array([1, 2]) }), '{"foo":Uint8Array([1,2])}');
        },
        'Function'() {
            const func = () => { };
            $mol_assert_equal($mol_key(func), $mol_key(func));
            $mol_assert_unique($mol_key(func), $mol_key(() => { }));
        },
        'Objects'() {
            class User {
            }
            const jin = new User();
            $mol_assert_equal($mol_key(jin), $mol_key(jin));
            $mol_assert_unique($mol_key(jin), $mol_key(new User()));
        },
        'Elements'() {
            const foo = $mol_jsx("div", null, "bar");
            $mol_assert_equal($mol_key(foo), $mol_key(foo));
            $mol_assert_unique($mol_key(foo), $mol_key($mol_jsx("div", null, "bar")));
        },
        'Custom JSON representation'() {
            class User {
                toJSON() { return 'jin'; }
            }
            $mol_assert_unique([$mol_key(new User)], [$mol_key(new User)]);
        },
        'Custom key handler'() {
            class User {
                name;
                age;
                constructor(name, age) {
                    this.name = name;
                    this.age = age;
                }
                [$mol_key_handle]() { return `User(${JSON.stringify(this.name)})`; }
            }
            $mol_assert_equal($mol_key([new User('jin', 16)]), $mol_key([new User('jin', 18)]), '[User("jin")]');
        },
        'Special native classes'() {
            $mol_assert_equal($mol_key(new Date('xyz')), 'Date(NaN)');
            $mol_assert_equal($mol_key(new Date(12345)), 'Date(12345)');
            $mol_assert_equal($mol_key(/./), '/./');
            $mol_assert_equal($mol_key(/\./gimsu), '/\\./gimsu');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        $.$mol_after_frame = $mol_after_mock_commmon;
    });
})($ || ($ = {}));

;
"use strict";

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'return result without errors'() {
            $mol_assert_equal($mol_try(() => false), false);
        },
        //'return error if thrown'() {
        //	
        //	const error = new Error( '$mol_try test error' )
        //	$mol_assert_equal( $mol_try( ()=> { throw error } ) , error )
        //	
        //} ,
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => $.$mol_fail_log = () => false);
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    /** Watch and logs reactive states. Logger automatically added to test bundle which is adding to `test.html`. */
    class $mol_wire_log extends $mol_object2 {
        static watch(task) {
            return task;
        }
        static track(fiber) {
            const prev = $mol_wire_probe(() => this.track(fiber));
            let next;
            try {
                next = fiber.sync();
            }
            finally {
                for (const pub of fiber.pub_list) {
                    if (pub instanceof $mol_wire_fiber) {
                        this.track(pub);
                    }
                }
            }
            if (fiber.host === this)
                return next;
            if ($mol_compare_deep(prev, next)) {
                this.$.$mol_log3_rise({
                    message: '💧 Same',
                    place: fiber,
                });
            }
            else if (prev !== undefined) {
                this.$.$mol_log3_rise({
                    message: '🔥 Next',
                    place: fiber,
                    prev,
                });
            }
            return next;
        }
        static active() {
            try {
                this.watch()?.();
            }
            catch (error) {
                $mol_fail_log(error);
            }
            finally {
                for (const pub of $mol_wire_auto().pub_list) {
                    if (pub instanceof $mol_wire_fiber) {
                        this.track(pub);
                    }
                }
            }
        }
    }
    __decorate([
        $mol_mem
    ], $mol_wire_log, "watch", null);
    __decorate([
        $mol_mem_key
    ], $mol_wire_log, "track", null);
    __decorate([
        $mol_mem
    ], $mol_wire_log, "active", null);
    $.$mol_wire_log = $mol_wire_log;
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_wire_log.active();
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'all cases of using maybe'() {
            $mol_assert_equal($mol_maybe(0)[0], 0);
            $mol_assert_equal($mol_maybe(false)[0], false);
            $mol_assert_equal($mol_maybe(null)[0], void 0);
            $mol_assert_equal($mol_maybe(void 0)[0], void 0);
            $mol_assert_equal($mol_maybe(void 0).map(v => v.toString())[0], void 0);
            $mol_assert_equal($mol_maybe(0).map(v => v.toString())[0], '0');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'run callback'() {
            class Plus1 extends $mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            }
            $mol_assert_equal(Plus1.run(() => 2), 3);
        },
        'wrap function'() {
            class Plus1 extends $mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            }
            const obj = {
                level: 2,
                pow: Plus1.func(function (a) {
                    return a ** this.level;
                })
            };
            $mol_assert_equal(obj.pow(2), 5);
        },
        'decorate field getter'() {
            class Plus1 extends $mol_wrapper {
                static last = 0;
                static wrap(task) {
                    return function (...args) {
                        return Plus1.last = (task.call(this, ...args) || 0) + 1;
                    };
                }
            }
            class Foo {
                static get two() {
                    return 1;
                }
                static set two(next) { }
            }
            __decorate([
                Plus1.field
            ], Foo, "two", null);
            $mol_assert_equal(Foo.two, 2);
            Foo.two = 3;
            $mol_assert_equal(Plus1.last, 2);
            $mol_assert_equal(Foo.two, 2);
        },
        'decorate instance method'() {
            class Plus1 extends $mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            }
            class Foo1 {
                level = 2;
                pow(a) {
                    return a ** this.level;
                }
            }
            __decorate([
                Plus1.method
            ], Foo1.prototype, "pow", null);
            const Foo2 = Foo1;
            const foo = new Foo2;
            $mol_assert_equal(foo.pow(2), 5);
        },
        'decorate static method'() {
            class Plus1 extends $mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            }
            class Foo {
                static level = 2;
                static pow(a) {
                    return a ** this.level;
                }
            }
            __decorate([
                Plus1.method
            ], Foo, "pow", null);
            $mol_assert_equal(Foo.pow(2), 5);
        },
        'decorate class'() {
            class BarInc extends $mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        const foo = task.call(this, ...args);
                        foo.bar++;
                        return foo;
                    };
                }
            }
            let Foo = class Foo {
                bar;
                constructor(bar) {
                    this.bar = bar;
                }
            };
            Foo = __decorate([
                BarInc.class
            ], Foo);
            $mol_assert_equal(new Foo(2).bar, 3);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'memoize field'() {
            class Foo {
                static one = 1;
                static get two() {
                    return ++this.one;
                }
                static set two(next) { }
            }
            __decorate([
                $mol_memo.field
            ], Foo, "two", null);
            $mol_assert_equal(Foo.two, 2);
            $mol_assert_equal(Foo.two, 2);
            Foo.two = 3;
            $mol_assert_equal(Foo.two, 3);
            $mol_assert_equal(Foo.two, 3);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'const returns stored value'() {
            const foo = { bar: $mol_const(Math.random()) };
            $mol_assert_equal(foo.bar(), foo.bar());
            $mol_assert_equal(foo.bar(), foo.bar['()']);
        },
    });
})($ || ($ = {}));

;
"use strict";

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'id auto generation'($) {
            class $mol_view_test_item extends $mol_view {
            }
            class $mol_view_test_block extends $mol_view {
                static $ = $;
                element(id) {
                    return new $mol_view_test_item();
                }
            }
            __decorate([
                $mol_mem_key
            ], $mol_view_test_block.prototype, "element", null);
            var x = $mol_view_test_block.Root(0);
            $mol_assert_equal(x.dom_node().id, '$mol_view_test_block.Root(0)');
            $mol_assert_equal(x.element(0).dom_node().id, '$mol_view_test_block.Root(0).element(0)');
        },
        'caching ref to dom node'($) {
            var x = new class extends $mol_view {
            };
            x.$ = $;
            $mol_assert_equal(x.dom_node(), x.dom_node());
        },
        'content render'($) {
            class $mol_view_test extends $mol_view {
                sub() {
                    return ['lol', 5];
                }
            }
            var x = new $mol_view_test();
            x.$ = $;
            var node = x.dom_tree();
            $mol_assert_equal(node.innerHTML, 'lol5');
        },
        'bem attributes generation'($) {
            class $mol_view_test_item extends $mol_view {
            }
            class $mol_view_test_block extends $mol_view {
                Element(id) {
                    return new $mol_view_test_item();
                }
            }
            __decorate([
                $mol_mem_key
            ], $mol_view_test_block.prototype, "Element", null);
            var x = new $mol_view_test_block();
            x.$ = $;
            $mol_assert_equal(x.dom_node().getAttribute('mol_view_test_block'), '');
            $mol_assert_equal(x.dom_node().getAttribute('mol_view'), '');
            $mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view_test_block_element'), '');
            $mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view_test_item'), '');
            $mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view'), '');
        },
        'render custom attributes'($) {
            class $mol_view_test extends $mol_view {
                attr() {
                    return {
                        'href': '#haha',
                        'required': true,
                        'hidden': false,
                    };
                }
            }
            var x = new $mol_view_test();
            x.$ = $;
            var node = x.dom_tree();
            $mol_assert_equal(node.getAttribute('href'), '#haha');
            $mol_assert_equal(node.getAttribute('required'), 'true');
            $mol_assert_equal(node.getAttribute('hidden'), null);
        },
        'render custom fields'($) {
            class $mol_view_test extends $mol_view {
                field() {
                    return {
                        'hidden': true
                    };
                }
            }
            var x = new $mol_view_test();
            x.$ = $;
            var node = x.dom_tree();
            $mol_assert_equal(node.hidden, true);
        },
        'attach event handlers'($) {
            var clicked = false;
            class $mol_view_test extends $mol_view {
                event() {
                    return {
                        'click': (next) => this.event_click(next)
                    };
                }
                event_click(next) {
                    clicked = true;
                }
            }
            var x = new $mol_view_test();
            x.$ = $;
            var node = x.dom_node();
            node.click();
            $mol_assert_ok(clicked);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    class $mol_style_sheet_test1 extends $mol_view {
        Item() { return new $mol_view; }
    }
    $.$mol_style_sheet_test1 = $mol_style_sheet_test1;
    class $mol_style_sheet_test2 extends $mol_view {
        List() { return new $mol_style_sheet_test1; }
    }
    $.$mol_style_sheet_test2 = $mol_style_sheet_test2;
    $mol_test({
        'component block styles'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                display: 'block',
                zIndex: 1,
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tdisplay: block;\n\tz-index: 1;\n}\n');
        },
        'various units'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                width: '50%',
                height: '50px',
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\twidth: 50%;\n\theight: 50px;\n}\n');
        },
        'various functions'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const { calc } = $mol_style_func;
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                width: calc(`100% - 1px`),
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\twidth: calc(100% - 1px);\n}\n');
        },
        'property groups'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                flex: {
                    grow: 5,
                    shrink: 10,
                }
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tflex-grow: 5;\n\tflex-shrink: 10;\n}\n');
        },
        'custom properties'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                '--isVariable': 'yes',
                '--is_variable': 'no',
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\t--is-variable: yes;\n\t--is_variable: no;\n}\n');
        },
        'custom property groups'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                '--variable': {
                    test1: '5px',
                    test2: '10px',
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\t--variable-test1: 5px;\n\t--variable-test2: 10px;\n}\n');
        },
        'property shorthand'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                padding: ['5px', 'auto'],
                margin: ['10px', 'auto'],
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tpadding: 5px auto;\n\tmargin: 10px auto;\n}\n');
        },
        'sequenced values'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const { url } = $mol_style_func;
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                background: {
                    image: [[url('foo')], [url('bar')]],
                    size: [['cover'], ['contain']],
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tbackground-image: url("foo"),url("bar");\n\tbackground-size: cover,contain;\n}\n');
        },
        'sequenced structs'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                box: {
                    shadow: [
                        {
                            inset: true,
                            x: 0,
                            y: 0,
                            blur: '0.5rem',
                            spread: 0,
                            color: 'red',
                        },
                        {
                            inset: false,
                            x: 0,
                            y: 0,
                            blur: '0.5rem',
                            spread: 0,
                            color: 'blue',
                        },
                    ],
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tbox-shadow: inset 0 0 0.5rem 0 red,0 0 0.5rem 0 blue;\n}\n');
        },
        'component block styles with pseudo class'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                color: 'red',
                ':focus': {
                    display: 'block',
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tcolor: red;\n}\n[mol_style_sheet_test]:focus {\n\tdisplay: block;\n}\n');
        },
        'component block styles with pseudo element'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                color: 'red',
                '::first-line': {
                    display: 'block',
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tcolor: red;\n}\n[mol_style_sheet_test]::first-line {\n\tdisplay: block;\n}\n');
        },
        'component block styles with media query'() {
            class $mol_style_sheet_test extends $mol_view {
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                color: 'red',
                '@media': {
                    'print': {
                        display: 'block',
                    },
                    '(max-width: 640px)': {
                        display: 'inline',
                    },
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tcolor: red;\n}\n@media print {\n[mol_style_sheet_test] {\n\tdisplay: block;\n}\n}\n@media (max-width: 640px) {\n[mol_style_sheet_test] {\n\tdisplay: inline;\n}\n}\n');
        },
        'component block styles with attribute value'() {
            class $mol_style_sheet_test extends $mol_view {
                attr() {
                    return {
                        mol_theme: '$mol_theme_dark'
                    };
                }
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                color: 'red',
                '@': {
                    mol_theme: {
                        '$mol_theme_dark': {
                            display: 'block',
                        },
                    },
                    disabled: {
                        'true': {
                            width: '100%',
                        },
                    },
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tcolor: red;\n}\n[mol_style_sheet_test]:where([mol_theme="$mol_theme_dark"]) {\n\tdisplay: block;\n}\n[mol_style_sheet_test]:where([disabled="true"]) {\n\twidth: 100%;\n}\n');
        },
        'component block styles with attribute value (short syntax)'() {
            class $mol_style_sheet_test extends $mol_view {
                attr() {
                    return {
                        mol_theme: '$mol_theme_dark'
                    };
                }
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                color: 'red',
                '[mol_theme]': {
                    '$mol_theme_dark': {
                        display: 'block',
                    },
                },
                '[disabled]': {
                    'true': {
                        width: '100%',
                    },
                    'false': {
                        width: '50%',
                    },
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tcolor: red;\n}\n[mol_style_sheet_test]:where([mol_theme="$mol_theme_dark"]) {\n\tdisplay: block;\n}\n[mol_style_sheet_test]:where([disabled="true"]) {\n\twidth: 100%;\n}\n[mol_style_sheet_test]:where([disabled="false"]) {\n\twidth: 50%;\n}\n');
        },
        'component element styles'() {
            class $mol_style_sheet_test extends $mol_view {
                Item() { return new $mol_view; }
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                color: 'red',
                Item: {
                    display: 'block',
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tcolor: red;\n}\n[mol_style_sheet_test_item] {\n\tdisplay: block;\n}\n');
        },
        'component element of element styles'() {
            const sheet = $mol_style_sheet($mol_style_sheet_test2, {
                width: '100%',
                List: {
                    color: 'red',
                    Item: {
                        display: 'block',
                    },
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test2] {\n\twidth: 100%;\n}\n[mol_style_sheet_test2_list] {\n\tcolor: red;\n}\n[mol_style_sheet_test2_list_item] {\n\tdisplay: block;\n}\n');
        },
        'component element styles with block attribute value'() {
            class $mol_style_sheet_test extends $mol_view {
                Item() { return new $mol_view; }
                attr() {
                    return {
                        mol_theme: '$mol_theme_dark',
                        disabled: true,
                    };
                }
            }
            const sheet = $mol_style_sheet($mol_style_sheet_test, {
                '@': {
                    mol_theme: {
                        '$mol_theme_dark': {
                            Item: {
                                color: 'red',
                            },
                        },
                    },
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test]:where([mol_theme="$mol_theme_dark"]) :where([mol_style_sheet_test_item]) {\n\tcolor: red;\n}\n');
        },
        'inner component styles by class'() {
            const sheet = $mol_style_sheet($mol_style_sheet_test2, {
                color: 'red',
                $mol_style_sheet_test1: {
                    display: 'block',
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test2] {\n\tcolor: red;\n}\n[mol_style_sheet_test2] :where([mol_style_sheet_test1]) {\n\tdisplay: block;\n}\n');
        },
        'child component styles by class'() {
            const sheet = $mol_style_sheet($mol_style_sheet_test2, {
                color: 'red',
                '>': {
                    $mol_style_sheet_test1: {
                        display: 'block',
                    },
                    $mol_style_sheet_test2: {
                        display: 'inline',
                    },
                },
            });
            $mol_assert_equal(sheet, '[mol_style_sheet_test2] {\n\tcolor: red;\n}\n[mol_style_sheet_test2] > :where([mol_style_sheet_test1]) {\n\tdisplay: block;\n}\n[mol_style_sheet_test2] > :where([mol_style_sheet_test2]) {\n\tdisplay: inline;\n}\n');
        },
    });
})($ || ($ = {}));

;
"use strict";

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push(context => {
        class $mol_state_arg_mock extends $mol_state_arg {
            static $ = context;
            static href(next) { return next || ''; }
            static go(next) {
                this.href(this.link(next));
            }
        }
        __decorate([
            $mol_mem
        ], $mol_state_arg_mock, "href", null);
        __decorate([
            $mol_action
        ], $mol_state_arg_mock, "go", null);
        context.$mol_state_arg = $mol_state_arg_mock;
    });
    $mol_test({
        'args as dictionary'($) {
            $.$mol_state_arg.href('#!foo=bar/xxx');
            $mol_assert_equal($.$mol_state_arg.dict(), { foo: 'bar', xxx: '' });
            $.$mol_state_arg.dict({ foo: null, yyy: '', lol: '123' });
            $mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#!yyy/lol=123');
        },
        'one value from args'($) {
            $.$mol_state_arg.href('#!foo=bar/xxx');
            $mol_assert_equal($.$mol_state_arg.value('foo'), 'bar');
            $mol_assert_equal($.$mol_state_arg.value('xxx'), '');
            $.$mol_state_arg.value('foo', 'lol');
            $mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#!foo=lol/xxx');
            $.$mol_state_arg.value('foo', '');
            $mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#!foo/xxx');
            $.$mol_state_arg.value('foo', null);
            $mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#!xxx');
        },
        'nested args'($) {
            const base = new $.$mol_state_arg('nested.');
            class Nested extends $mol_state_arg {
                constructor(prefix) {
                    super(base.prefix + prefix);
                }
                static value = (key, next) => base.value(key, next);
            }
            $.$mol_state_arg.href('#!foo=bar/nested.xxx=123');
            $mol_assert_equal(Nested.value('foo'), null);
            $mol_assert_equal(Nested.value('xxx'), '123');
            Nested.value('foo', 'lol');
            $mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#!foo=bar/nested.xxx=123/nested.foo=lol');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'local get set delete'() {
            var key = '$mol_state_local_test:' + Math.random();
            $mol_assert_equal($mol_state_local.value(key), null);
            $mol_state_local.value(key, 123);
            $mol_assert_equal($mol_state_local.value(key), 123);
            $mol_state_local.value(key, null);
            $mol_assert_equal($mol_state_local.value(key), null);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test_mocks.push(context => {
        class $mol_state_local_mock extends $mol_state_local {
            static state = {};
            static value(key, next = this.state[key]) {
                return this.state[key] = (next || null);
            }
        }
        __decorate([
            $mol_mem_key
        ], $mol_state_local_mock, "value", null);
        context.$mol_state_local = $mol_state_local_mock;
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    class TestClass extends Uint8Array {
    }
    $mol_test({
        'Uint8Array vs itself'() {
            $mol_assert_ok($mol_compare_array(new Uint8Array, new Uint8Array));
            $mol_assert_ok($mol_compare_array(new Uint8Array([0]), new Uint8Array([0])));
            $mol_assert_not($mol_compare_array(new Uint8Array([0]), new Uint8Array([1])));
        },
        'Uint8Array vs subclassed array'() {
            $mol_assert_not($mol_compare_array(new Uint8Array, new TestClass));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'decode utf8 string'() {
            const str = 'Hello, ΧΨΩЫ';
            const encoded = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 206, 167, 206, 168, 206, 169, 208, 171]);
            $mol_assert_equal($mol_charset_decode(encoded), str);
            $mol_assert_equal($mol_charset_decode(encoded, 'utf8'), str);
        },
        'decode empty string'() {
            const encoded = new Uint8Array([]);
            $mol_assert_equal($mol_charset_decode(encoded), '');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'encode empty'() {
            $mol_assert_equal($mol_charset_encode(''), new Uint8Array([]));
        },
        'encode 1 octet'() {
            $mol_assert_equal($mol_charset_encode('F'), new Uint8Array([0x46]));
        },
        'encode 2 octet'() {
            $mol_assert_equal($mol_charset_encode('Б'), new Uint8Array([0xd0, 0x91]));
        },
        'encode 3 octet'() {
            $mol_assert_equal($mol_charset_encode('ह'), new Uint8Array([0xe0, 0xa4, 0xb9]));
        },
        'encode 4 octet'() {
            $mol_assert_equal($mol_charset_encode('𐍈'), new Uint8Array([0xf0, 0x90, 0x8d, 0x88]));
        },
        'encode surrogate pair'() {
            $mol_assert_equal($mol_charset_encode('😀'), new Uint8Array([0xf0, 0x9f, 0x98, 0x80]));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'auto name'() {
            class Invalid extends $mol_error_mix {
            }
            const mix = new Invalid('foo');
            $mol_assert_equal(mix.name, 'Invalid_Error');
        },
        'simpe mix'() {
            const mix = new $mol_error_mix('foo', {}, new Error('bar'), new Error('lol'));
            $mol_assert_equal(mix.message, 'foo');
            $mol_assert_equal(mix.errors.map(e => e.message), ['bar', 'lol']);
        },
        'provide additional info'() {
            class Invalid extends $mol_error_mix {
            }
            const mix = new $mol_error_mix('Wrong password', {}, new Invalid('Too short', { value: 'p@ssw0rd', hint: '> 8 letters' }), new Invalid('Too simple', { value: 'p@ssw0rd', hint: 'need capital letter' }));
            const hints = [];
            if (mix instanceof $mol_error_mix) {
                for (const er of mix.errors) {
                    if (er instanceof Invalid) {
                        hints.push(er.cause?.hint ?? '');
                    }
                }
            }
            $mol_assert_equal(hints, ['> 8 letters', 'need capital letter']);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            async "Get and parse"($) {
                $mol_assert_equal(await $mol_wire_async($mol_fetch).text('data:text/plain,foo'), 'foo');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        class $mol_locale_mock extends $mol_locale {
            lang(next = 'en') { return next; }
            static source(lang) {
                return {};
            }
        }
        __decorate([
            $mol_mem
        ], $mol_locale_mock.prototype, "lang", null);
        __decorate([
            $mol_mem_key
        ], $mol_locale_mock, "source", null);
        $.$mol_locale = $mol_locale_mock;
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            'handle clicks by default'($) {
                let clicked = false;
                const clicker = $mol_button.make({
                    $,
                    click: (event) => { clicked = true; },
                });
                const element = clicker.dom_tree();
                const event = $mol_dom_context.document.createEvent('mouseevent');
                event.initEvent('click', true, true);
                element.dispatchEvent(event);
                $mol_assert_ok(clicked);
            },
            'no handle clicks if disabled'($) {
                let clicked = false;
                const clicker = $mol_button.make({
                    $,
                    click: (event) => { clicked = true; },
                    enabled: () => false,
                });
                const element = clicker.dom_tree();
                const event = $mol_dom_context.document.createEvent('mouseevent');
                event.initEvent('click', true, true);
                element.dispatchEvent(event);
                $mol_assert_not(clicked);
            },
            async 'Store error'($) {
                const clicker = $mol_button.make({
                    $,
                    click: (event) => $.$mol_fail(new Error('Test error')),
                });
                const event = $mol_dom_context.document.createEvent('mouseevent');
                $mol_assert_fail(() => clicker.event_activate(event), 'Test error');
                await Promise.resolve();
                $mol_assert_equal(clicker.status()[0].message, 'Test error');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";

;
"use strict";

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'escape'() {
            const specials = $mol_regexp.from('.*+?^${}()|[]\\');
            $mol_assert_equal(specials.source, '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
        },
        'char code'() {
            const space = $mol_regexp.from(32);
            $mol_assert_like(' '.match(space), [' ']);
        },
        'repeat fixed'() {
            const { repeat, decimal_only: digit } = $mol_regexp;
            const year = repeat(digit, 4, 4);
            $mol_assert_like('#2020#'.match(year), ['2020']);
        },
        'greedy repeat'() {
            const { repeat, repeat_greedy, latin_only: letter } = $mol_regexp;
            $mol_assert_like('abc'.match(repeat(letter, 1, 2)), ['a', 'b', 'c']);
            $mol_assert_like('abc'.match(repeat_greedy(letter, 1, 2)), ['ab', 'c']);
        },
        'repeat range'() {
            const { repeat_greedy, decimal_only: digit } = $mol_regexp;
            const year = repeat_greedy(digit, 2, 4);
            $mol_assert_like('#2#'.match(year), null);
            $mol_assert_like('#20#'.match(year), ['20']);
            $mol_assert_like('#2020#'.match(year), ['2020']);
            $mol_assert_like('#20201#'.match(year), ['2020']);
        },
        'repeat from'() {
            const { repeat_greedy, latin_only: letter } = $mol_regexp;
            const name = repeat_greedy(letter, 2);
            $mol_assert_like('##'.match(name), null);
            $mol_assert_like('#a#'.match(name), null);
            $mol_assert_like('#ab#'.match(name), ['ab']);
            $mol_assert_like('#abc#'.match(name), ['abc']);
        },
        'from string'() {
            const regexp = $mol_regexp.from('[\\d]');
            $mol_assert_equal(regexp.source, '\\[\\\\d\\]');
            $mol_assert_equal(regexp.flags, 'gsu');
        },
        'from regexp'() {
            const regexp = $mol_regexp.from(/[\d]/i);
            $mol_assert_equal(regexp.source, '[\\d]');
            $mol_assert_equal(regexp.flags, 'i');
        },
        'split'() {
            const regexp = $mol_regexp.from(';');
            $mol_assert_like('aaa;bbb;ccc'.split(regexp), ['aaa', ';', 'bbb', ';', 'ccc']);
            $mol_assert_like('aaa;;ccc'.split(regexp), ['aaa', ';', '', ';', 'ccc']);
            $mol_assert_like('aaa'.split(regexp), ['aaa']);
            $mol_assert_like(''.split(regexp), ['']);
        },
        'test for matching'() {
            const regexp = $mol_regexp.from('foo');
            $mol_assert_like(regexp.test(''), false);
            $mol_assert_like(regexp.test('fo'), false);
            $mol_assert_like(regexp.test('foo'), true);
            $mol_assert_like(regexp.test('foobar'), true);
            $mol_assert_like(regexp.test('barfoo'), true);
        },
        'case ignoring'() {
            const xxx = $mol_regexp.from('x', { ignoreCase: true });
            $mol_assert_like(xxx.flags, 'gisu');
            $mol_assert_like(xxx.exec('xx')[0], 'x');
            $mol_assert_like(xxx.exec('XX')[0], 'X');
        },
        'multiline mode'() {
            const { end, from } = $mol_regexp;
            const xxx = from(['x', end], { multiline: true });
            $mol_assert_like(xxx.exec('x\ny')[0], 'x');
            $mol_assert_like(xxx.flags, 'gmsu');
        },
        'flags override'() {
            const triplet = $mol_regexp.from($mol_regexp.from(/.../, { ignoreCase: true }), { multiline: true });
            $mol_assert_like(triplet.toString(), '/.../gmsu');
        },
        'sequence'() {
            const { begin, end, decimal_only: digit, repeat, from } = $mol_regexp;
            const year = repeat(digit, 4, 4);
            const dash = '-';
            const month = repeat(digit, 2, 2);
            const day = repeat(digit, 2, 2);
            const date = from([begin, year, dash, month, dash, day, end]);
            $mol_assert_like(date.exec('2020-01-02')[0], '2020-01-02');
        },
        'optional'() {
            const name = $mol_regexp.from(['A', ['4']]);
            $mol_assert_equal('AB'.match(name)[0], 'A');
            $mol_assert_equal('A4'.match(name)[0], 'A4');
        },
        'anon variants'() {
            const name = $mol_regexp.from(['A', $mol_regexp.vary(['4', '5'])]);
            $mol_assert_equal('AB'.match(name), null);
            $mol_assert_equal('A4'.match(name)[0], 'A4');
            $mol_assert_equal('A5'.match(name)[0], 'A5');
        },
        'only groups'() {
            const regexp = $mol_regexp.from({ dog: '@' });
            $mol_assert_like([...'#'.matchAll(regexp)][0].groups, undefined);
            $mol_assert_like([...'@'.matchAll(regexp)][0].groups, { dog: '@' });
        },
        'catch skipped'() {
            const regexp = $mol_regexp.from(/(@)(\d?)/g);
            $mol_assert_like([...'[[@]]'.matchAll(regexp)].map(f => [...f]), [
                ['[['],
                ['@', '@', ''],
                [']]'],
            ]);
        },
        'enum variants'() {
            let Sex;
            (function (Sex) {
                Sex["male"] = "male";
                Sex["female"] = "female";
            })(Sex || (Sex = {}));
            const sexism = $mol_regexp.from(Sex);
            $mol_assert_like([...''.matchAll(sexism)].length, 0);
            $mol_assert_like([...'trans'.matchAll(sexism)][0].groups, undefined);
            $mol_assert_like([...'male'.matchAll(sexism)][0].groups, { male: 'male', female: '' });
            $mol_assert_like([...'female'.matchAll(sexism)][0].groups, { male: '', female: 'female' });
        },
        'recursive only groups'() {
            let Sex;
            (function (Sex) {
                Sex["male"] = "male";
                Sex["female"] = "female";
            })(Sex || (Sex = {}));
            const sexism = $mol_regexp.from({ Sex });
            $mol_assert_like([...''.matchAll(sexism)].length, 0);
            $mol_assert_like([...'male'.matchAll(sexism)][0].groups, { Sex: 'male', male: 'male', female: '' });
            $mol_assert_like([...'female'.matchAll(sexism)][0].groups, { Sex: 'female', male: '', female: 'female' });
        },
        'sequence with groups'() {
            const { begin, end, decimal_only: digit, repeat, from } = $mol_regexp;
            const year = repeat(digit, 4, 4);
            const dash = '-';
            const month = repeat(digit, 2, 2);
            const day = repeat(digit, 2, 2);
            const regexp = from([begin, { year }, dash, { month }, dash, { day }, end]);
            const found = [...'2020-01-02'.matchAll(regexp)];
            $mol_assert_like(found[0].groups, {
                year: '2020',
                month: '01',
                day: '02',
            });
        },
        'sequence with groups of mixed type'() {
            const prefix = '/';
            const postfix = '/';
            const regexp = $mol_regexp.from([{ prefix }, /(\w+)/, { postfix }, /([gumi]*)/]);
            $mol_assert_like([...'/foo/mi'.matchAll(regexp)], [
                Object.assign(["/foo/mi", "/", "foo", "/", "mi"], {
                    groups: {
                        prefix: '/',
                        postfix: '/',
                    },
                    index: 0,
                    input: "/",
                }),
            ]);
        },
        'recursive sequence with groups'() {
            const { begin, end, decimal_only: digit, repeat, from } = $mol_regexp;
            const year = repeat(digit, 4, 4);
            const dash = '-';
            const month = repeat(digit, 2, 2);
            const day = repeat(digit, 2, 2);
            const regexp = from([
                begin, { date: [{ year }, dash, { month }] }, dash, { day }, end
            ]);
            const found = [...'2020-01-02'.matchAll(regexp)];
            $mol_assert_like(found[0].groups, {
                date: '2020-01',
                year: '2020',
                month: '01',
                day: '02',
            });
        },
        'parse multiple'() {
            const { decimal_only: digit, from } = $mol_regexp;
            const regexp = from({ digit });
            $mol_assert_like([...'123'.matchAll(regexp)].map(f => f.groups), [
                { digit: '1' },
                { digit: '2' },
                { digit: '3' },
            ]);
        },
        'named variants'() {
            const { begin, or, end, from } = $mol_regexp;
            const sexism = from([
                begin, 'sex = ', { sex: ['male', or, 'female'] }, end
            ]);
            $mol_assert_like([...'sex = male'.matchAll(sexism)][0].groups, { sex: 'male' });
            $mol_assert_like([...'sex = female'.matchAll(sexism)][0].groups, { sex: 'female' });
            $mol_assert_like([...'sex = malefemale'.matchAll(sexism)][0].groups, undefined);
        },
        'force after'() {
            const { latin_only: letter, force_after, from } = $mol_regexp;
            const regexp = from([letter, force_after('.')]);
            $mol_assert_like('x.'.match(regexp), ['x']);
            $mol_assert_like('x,'.match(regexp), null);
        },
        'forbid after'() {
            const { latin_only: letter, forbid_after, from } = $mol_regexp;
            const regexp = from([letter, forbid_after('.')]);
            $mol_assert_like('x.'.match(regexp), null);
            $mol_assert_like('x,'.match(regexp), ['x']);
        },
        'char except'() {
            const { char_except, latin_only, tab } = $mol_regexp;
            const name = char_except(latin_only, tab);
            $mol_assert_like('a'.match(name), null);
            $mol_assert_like('\t'.match(name), null);
            $mol_assert_like('('.match(name), ['(']);
        },
        'unicode only'() {
            const { unicode_only, from } = $mol_regexp;
            const name = from([
                unicode_only('Script', 'Cyrillic'),
                unicode_only('Hex_Digit'),
            ]);
            $mol_assert_like('FF'.match(name), null);
            $mol_assert_like('ФG'.match(name), null);
            $mol_assert_like('ФF'.match(name), ['ФF']);
        },
        'generate by optional with inner group'() {
            const { begin, end, from } = $mol_regexp;
            const animals = from([begin, '#', ['^', { dog: '@' }], end]);
            $mol_assert_equal(animals.generate({}), '#');
            $mol_assert_equal(animals.generate({ dog: false }), '#');
            $mol_assert_equal(animals.generate({ dog: true }), '#^@');
            $mol_assert_fail(() => animals.generate({ dog: '$' }), 'Wrong param: dog=$');
        },
        'generate by optional with inner group with variants'() {
            const { begin, end, from } = $mol_regexp;
            const animals = from([begin, '#', ['^', { animal: { dog: '@', fox: '&' } }], end]);
            $mol_assert_equal(animals.generate({}), '#');
            $mol_assert_equal(animals.generate({ dog: true }), '#^@');
            $mol_assert_equal(animals.generate({ fox: true }), '#^&');
            $mol_assert_fail(() => animals.generate({ dog: '$' }), 'Wrong param: dog=$');
        },
        'complex example'() {
            const { begin, end, char_only, char_range, latin_only, slash_back, repeat_greedy, from, } = $mol_regexp;
            const atom_char = char_only(latin_only, "!#$%&'*+/=?^`{|}~-");
            const atom = repeat_greedy(atom_char, 1);
            const dot_atom = from([atom, repeat_greedy(['.', atom])]);
            const name_letter = char_only(char_range(0x01, 0x08), 0x0b, 0x0c, char_range(0x0e, 0x1f), 0x21, char_range(0x23, 0x5b), char_range(0x5d, 0x7f));
            const quoted_pair = from([
                slash_back,
                char_only(char_range(0x01, 0x09), 0x0b, 0x0c, char_range(0x0e, 0x7f))
            ]);
            const name = repeat_greedy({ name_letter, quoted_pair });
            const quoted_name = from(['"', { name }, '"']);
            const local_part = from({ dot_atom, quoted_name });
            const domain = dot_atom;
            const mail = from([begin, local_part, '@', { domain }, end]);
            $mol_assert_equal('foo..bar@example.org'.match(mail), null);
            $mol_assert_equal('foo..bar"@example.org'.match(mail), null);
            $mol_assert_like([...'foo.bar@example.org'.matchAll(mail)][0].groups, {
                dot_atom: "foo.bar",
                quoted_name: "",
                name: "",
                name_letter: "",
                quoted_pair: "",
                domain: "example.org",
            });
            $mol_assert_like([...'"foo..bar"@example.org'.matchAll(mail)][0].groups, {
                dot_atom: "",
                quoted_name: '"foo..bar"',
                name: "foo..bar",
                name_letter: "r",
                quoted_pair: "",
                domain: "example.org",
            });
            $mol_assert_equal(mail.generate({ dot_atom: 'foo.bar', domain: 'example.org' }), 'foo.bar@example.org');
            $mol_assert_equal(mail.generate({ name: 'foo..bar', domain: 'example.org' }), '"foo..bar"@example.org');
            $mol_assert_fail(() => mail.generate({ dot_atom: 'foo..bar', domain: 'example.org' }), 'Wrong param: dot_atom=foo..bar');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        $mol_test({
            'Empty needle'() {
                const app = new $mol_dimmer;
                app.needle = () => '  ';
                app.haystack = () => 'foo  bar';
                $mol_assert_like(app.strings(), ['foo  bar']);
            },
            'Empty haystack'() {
                const app = new $mol_dimmer;
                app.needle = () => 'foo  bar';
                app.haystack = () => '';
                $mol_assert_like(app.strings(), ['']);
            },
            'Not found'() {
                const app = new $mol_dimmer;
                app.needle = () => 'foo';
                app.haystack = () => ' bar ';
                $mol_assert_like(app.strings(), [' bar ']);
            },
            'One found'() {
                const app = new $mol_dimmer;
                app.needle = () => 'foo';
                app.haystack = () => ' barfoo ';
                $mol_assert_like(app.strings(), [' bar', 'foo', ' ']);
            },
            'Multiple found'() {
                const app = new $mol_dimmer;
                app.needle = () => 'foo';
                app.haystack = () => ' foobarfoo foo';
                $mol_assert_like(app.strings(), [' ', 'foo', 'bar', 'foo', ' ', 'foo']);
            },
            'Fuzzy search'() {
                const app = new $mol_dimmer;
                app.needle = () => 'foo bar';
                app.haystack = () => ' barfoo ';
                $mol_assert_like(app.strings(), [' ', 'bar', '', 'foo', ' ']);
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'Watch one value'($) {
            class App extends $mol_object2 {
                static $ = $;
                static set = new $mol_wire_set();
                static lucky() {
                    return this.set.has(777);
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "lucky", null);
            $mol_assert_equal(App.lucky(), false);
            App.set.add(666);
            $mol_assert_equal(App.lucky(), false);
            App.set.add(777);
            $mol_assert_equal(App.lucky(), true);
            App.set.delete(777);
            $mol_assert_equal(App.lucky(), false);
        },
        'Watch item channel'($) {
            class App extends $mol_object2 {
                static $ = $;
                static set = new $mol_wire_set();
                static lucky() {
                    return this.set.item(777);
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "lucky", null);
            $mol_assert_equal(App.lucky(), false);
            App.set.item(666, true);
            $mol_assert_equal(App.lucky(), false);
            App.set.item(777, true);
            $mol_assert_equal(App.lucky(), true);
            App.set.item(777, false);
            $mol_assert_equal(App.lucky(), false);
        },
        'Watch size'($) {
            class App extends $mol_object2 {
                static $ = $;
                static set = new $mol_wire_set();
                static size() {
                    return this.set.size;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "size", null);
            $mol_assert_equal(App.size(), 0);
            App.set.add(666);
            $mol_assert_equal(App.size(), 1);
            App.set.add(777);
            $mol_assert_equal(App.size(), 2);
            App.set.delete(777);
            $mol_assert_equal(App.size(), 1);
        },
        'Watch for-of'($) {
            class App extends $mol_object2 {
                static $ = $;
                static set = new $mol_wire_set();
                static sum() {
                    let res = 0;
                    for (const val of this.set) {
                        res += val;
                    }
                    return res;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "sum", null);
            $mol_assert_equal(App.sum(), 0);
            App.set.add(111);
            $mol_assert_equal(App.sum(), 111);
            App.set.add(222);
            $mol_assert_equal(App.sum(), 333);
            App.set.delete(111);
            $mol_assert_equal(App.sum(), 222);
        },
        'Watch forEach'($) {
            class App extends $mol_object2 {
                static $ = $;
                static set = new $mol_wire_set();
                static sum() {
                    let res = 0;
                    this.set.forEach(val => res += val);
                    return res;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "sum", null);
            $mol_assert_equal(App.sum(), 0);
            App.set.add(111);
            $mol_assert_equal(App.sum(), 111);
            App.set.add(222);
            $mol_assert_equal(App.sum(), 333);
            App.set.delete(111);
            $mol_assert_equal(App.sum(), 222);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    const png = new Uint8Array([0x1a, 0x0a, 0x00, 0x49, 0x48, 0x78, 0xda]);
    $mol_test({
        'base64 encode string'() {
            $mol_assert_equal($mol_base64_encode($mol_charset_encode('Hello, ΧΨΩЫ')), 'SGVsbG8sIM6nzqjOqdCr');
        },
        'base64 encode binary'() {
            $mol_assert_equal($mol_base64_encode(png), 'GgoASUh42g==');
        },
        'base64 encode string with plus'() {
            $mol_assert_equal($mol_base64_encode($mol_charset_encode('шоешпо')), '0YjQvtC10YjQv9C+');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    const png = new Uint8Array([0x1a, 0x0a, 0x00, 0x49, 0x48, 0x78, 0xda]);
    const with_plus = new TextEncoder().encode('шоешпо');
    $mol_test({
        'base64 decode string'() {
            $mol_assert_equal($mol_base64_decode('SGVsbG8sIM6nzqjOqdCr'), new TextEncoder().encode('Hello, ΧΨΩЫ'));
        },
        'base64 decode binary'() {
            $mol_assert_equal($mol_base64_decode('GgoASUh42g=='), png);
        },
        'base64 decode binary - without equals'() {
            $mol_assert_equal($mol_base64_decode('GgoASUh42g'), png);
        },
        'base64 decode with plus'() {
            $mol_assert_equal($mol_base64_decode('0YjQvtC10YjQv9C+'), with_plus);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'empty hash'() {
            $mol_assert_equal($mol_crypto2_hash(new Uint8Array([])), new Uint8Array([218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]));
        },
        'three bytes hash'() {
            $mol_assert_equal($mol_crypto2_hash(new Uint8Array([255, 254, 253])), new Uint8Array([240, 150, 38, 243, 255, 128, 96, 0, 72, 215, 207, 228, 19, 149, 113, 52, 2, 125, 27, 77]));
        },
        'six bytes hash'() {
            $mol_assert_equal($mol_crypto2_hash(new Uint8Array([0, 255, 10, 250, 32, 128])), new Uint8Array([23, 25, 155, 181, 46, 200, 221, 83, 254, 0, 166, 68, 91, 255, 67, 140, 114, 88, 218, 155]));
        },
        'seven bytes hash'() {
            $mol_assert_equal($mol_crypto2_hash(new Uint8Array([1, 2, 3, 4, 5, 6, 7])), new Uint8Array([140, 31, 40, 252, 47, 72, 194, 113, 214, 196, 152, 240, 242, 73, 205, 222, 54, 92, 84, 197]));
        },
        'unaligned hash'() {
            const data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
            $mol_assert_equal($mol_crypto2_hash(new Uint8Array(data.buffer, 1, 7)), new Uint8Array([140, 31, 40, 252, 47, 72, 194, 113, 214, 196, 152, 240, 242, 73, 205, 222, 54, 92, 84, 197]));
        },
        async 'reference'() {
            const data = new Uint8Array([255, 254, 253]);
            $mol_assert_equal($mol_crypto2_hash(data), new Uint8Array(await $mol_crypto_native.subtle.digest('SHA-1', data)));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Float schema"($) {
                $mol_assert_equal('$mol_schema_float', $mol_schema_float + '', $mol_key($mol_schema_float));
                $mol_assert_equal(true, $mol_schema_float.check(0));
                $mol_assert_equal(true, $mol_schema_float.check(Number.NaN));
                $mol_assert_equal(true, $mol_schema_float.check(Number.POSITIVE_INFINITY));
                $mol_assert_equal(false, $mol_schema_float.check(null));
                $mol_assert_equal(1.5, $mol_schema_float.cast(1.5));
                $mol_assert_equal(Number.NaN, $mol_schema_float.cast('0'));
                $mol_assert_equal(Number.EPSILON, $mol_schema_float.guard(Number.EPSILON));
                $mol_assert_fail(() => $mol_schema_float.guard('0'), 'Wrong type');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "String schema"($) {
                $mol_assert_equal('$mol_schema_string', $mol_schema_string + '', $mol_key($mol_schema_string));
                $mol_assert_equal(true, $mol_schema_string.check('foo'));
                $mol_assert_equal(false, $mol_schema_string.check(123));
                $mol_assert_equal('foo', $mol_schema_string.cast('foo'));
                $mol_assert_equal('', $mol_schema_string.cast(123));
                $mol_assert_equal('foo', $mol_schema_string.guard('foo'));
                $mol_assert_fail(() => $mol_schema_string.guard(123), 'Wrong type');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Cache of maybe schema"($) {
                $mol_assert_equal($mol_schema_maybe($mol_schema_float), $mol_schema_maybe($mol_schema_float));
                $mol_assert_unique($mol_schema_maybe($mol_schema_float), $mol_schema_maybe($mol_schema_string));
            },
            "Optional value"($) {
                const Config = $mol_schema_maybe($mol_schema_string);
                $mol_assert_equal('$mol_schema_maybe<$mol_schema_string>', Config + '');
                $mol_assert_equal(true, Config.check('foo'));
                $mol_assert_equal(true, Config.check(undefined));
                $mol_assert_equal(true, Config.check(null));
                $mol_assert_equal(false, Config.check(0));
                $mol_assert_equal('foo', Config.cast('foo'));
                $mol_assert_equal(undefined, Config.cast(undefined));
                $mol_assert_equal(null, Config.cast(null));
                $mol_assert_equal(null, Config.cast(0));
                $mol_assert_equal('foo', Config.guard('foo'));
                $mol_assert_fail(() => Config.guard(123), 'Wrong type');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Cache of instance schema"($) {
                $mol_assert_equal($mol_schema_instance(Uint8Array), $mol_schema_instance(Uint8Array));
                $mol_assert_unique($mol_schema_instance(Uint8Array), $mol_schema_instance(Int8Array));
            },
            "Class instance schema"($) {
                const Blob = $mol_schema_instance(Uint8Array);
                $mol_assert_equal('$mol_schema_instance<Uint8Array>', Blob + '', $mol_key(Blob));
                $mol_assert_equal(true, Blob.check(new Uint8Array));
                $mol_assert_equal(false, Blob.check(new Int8Array));
                $mol_assert_equal(false, Blob.check(null));
                $mol_assert_equal(new Uint8Array([0, 1]), Blob.cast(new Uint8Array([0, 1])));
                $mol_assert_fail(() => Blob.cast(new Int8Array), 'Wrong class');
                $mol_assert_equal(new Uint8Array, Blob.guard(new Uint8Array));
                $mol_assert_fail(() => Blob.guard(new Int8Array), 'Wrong class');
            },
            "Boxed instance schema"($) {
                const Str = $mol_schema_instance(String);
                $mol_assert_equal('$mol_schema_instance<String>', Str + '', $mol_key(Str));
                $mol_assert_equal(true, Str.check(Object('')));
                $mol_assert_equal(true, Str.check(''));
                $mol_assert_equal(true, Object('') instanceof Str);
            },
            "Schema instance schema"($) {
                const Str = $mol_schema_instance($mol_schema_instance(String));
                $mol_assert_equal('$mol_schema_instance<String>', Str + '', $mol_key(Str));
                $mol_assert_equal(true, Str.check(Object('')));
                $mol_assert_equal(true, Str.check(''));
                $mol_assert_equal(true, Object('') instanceof Str);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Validation"($) {
                $mol_assert_fail(() => new $giper_baza_link('qwertyui_asdfghjk123'), 'Wrong Link (qwertyui_asdfghjk123)');
            },
            "From integer"($) {
                $mol_assert_equal($giper_baza_link.from_int(178308648732587), new $giper_baza_link('qwertyui'));
            },
            "Pick Lord only"($) {
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0').lord(), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed').lord(), new $giper_baza_link('qwertyui_asdfghjk').lord(), new $giper_baza_link('qwertyui_asdfghjk'));
            },
            "Pick Land only"($) {
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').land(), new $giper_baza_link('qwertyui_asdfghjk').land(), new $giper_baza_link('qwertyui_asdfghjk'));
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0').land(), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed').land(), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed'));
            },
            "Pick Peer only"($) {
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0').peer(), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').peer(), new $giper_baza_link('qwertyui'));
                $mol_assert_equal(new $giper_baza_link('___qazwsxed').peer(), new $giper_baza_link(''));
            },
            "Pick Head only"($) {
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0').head(), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').head(), new $giper_baza_link('zxcvbnm0'));
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed').head(), new $giper_baza_link('qwertyui_asdfghjk').head(), new $giper_baza_link(''));
            },
            "Pick Area only"($) {
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed').area(), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0').area(), new $giper_baza_link('qazwsxed'));
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').area(), new $giper_baza_link('qwertyui_asdfghjk').area(), new $giper_baza_link('').area(), new $giper_baza_link(''));
            },
            "Binary encoding"($) {
                const pawn = new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0').toBin();
                const land = new $giper_baza_link('qwertyui_asdfghjk_qazwsxed').toBin();
                const lord = new $giper_baza_link('qwertyui_asdfghjk').toBin();
                const rel_pawn = new $giper_baza_link('___zxcvbnm0').toBin();
                const rel_root = new $giper_baza_link('').toBin();
                $mol_assert_equal(pawn.length, 24);
                $mol_assert_equal(land.length, 18);
                $mol_assert_equal(lord.length, 12);
                $mol_assert_equal(rel_pawn.length, 6);
                $mol_assert_equal(rel_root.length, 0);
                $mol_assert_equal($giper_baza_link.from_bin(pawn), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0'));
                $mol_assert_equal($giper_baza_link.from_bin(land), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed'));
                $mol_assert_equal($giper_baza_link.from_bin(lord), new $giper_baza_link('qwertyui_asdfghjk'));
                $mol_assert_equal($giper_baza_link.from_bin(rel_pawn), new $giper_baza_link('zxcvbnm0'));
                $mol_assert_equal($giper_baza_link.from_bin(rel_root), new $giper_baza_link(''));
            },
            "Relate to base"($) {
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').relate(new $giper_baza_link('QWERTYUI_ASDFGHJK')), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').relate(new $giper_baza_link('QWERTYUI_ASDFGHJK__ZXCVBNM0')), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0'));
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0').relate(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed')), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0').relate(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_12345678')), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').relate(new $giper_baza_link('qwertyui_asdfghjk')), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').relate(new $giper_baza_link('qwertyui_asdfghjk__12345678')), new $giper_baza_link('___zxcvbnm0'));
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed').relate(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0')), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed').relate(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed')), new $giper_baza_link('qwertyui_asdfghjk').relate(new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0')), new $giper_baza_link('qwertyui_asdfghjk').relate(new $giper_baza_link('qwertyui_asdfghjk')), new $giper_baza_link(''));
            },
            "Resolve Link from base"($) {
                $mol_assert_equal(new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').resolve(new $giper_baza_link('QWERTYUI_ASDFGHJK__ZXCVBNM0')), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').resolve(new $giper_baza_link('QWERTYUI_ASDFGHJK')), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0').resolve(new $giper_baza_link('qwertyui_asdfghjk')), new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0'));
                $mol_assert_equal(new $giper_baza_link('___12345678').resolve(new $giper_baza_link('qwertyui_asdfghjk')), new $giper_baza_link('___12345678').resolve(new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0')), new $giper_baza_link('qwertyui_asdfghjk__12345678'));
                $mol_assert_equal(new $giper_baza_link('___12345678').resolve(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed')), new $giper_baza_link('___12345678').resolve(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0')), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_12345678'));
                $mol_assert_equal(new $giper_baza_link('').resolve(new $giper_baza_link('qwertyui_asdfghjk')), new $giper_baza_link('').resolve(new $giper_baza_link('qwertyui_asdfghjk__zxcvbnm0')), new $giper_baza_link('qwertyui_asdfghjk'));
                $mol_assert_equal(new $giper_baza_link('').resolve(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed')), new $giper_baza_link('').resolve(new $giper_baza_link('qwertyui_asdfghjk_qazwsxed_zxcvbnm0')), new $giper_baza_link('qwertyui_asdfghjk_qazwsxed'));
            },
            'Hashing'() {
                $mol_assert_equal($giper_baza_link.hash_bin(new Uint8Array([1, 2, 3])), new $giper_baza_link('cDeAcZjC_Kn0rCAc3'));
                $mol_assert_equal($giper_baza_link.hash_str('foo bar'), new $giper_baza_link('N3PeplFW_kJg4æmwi'));
            }
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        async 'str & bin sizes'() {
            const signer = await $$.$mol_crypto2_signer.generate();
            const auditor = signer.auditor();
            $mol_assert_equal(signer.toStringPrivate().length, $mol_crypto2_signer.size_str);
            $mol_assert_equal(auditor.toString().length, $mol_crypto2_auditor.size_str);
            $mol_assert_equal(signer.asArrayPrivate().length, $mol_crypto2_signer.size_bin);
            $mol_assert_equal(auditor.asArray().length, $mol_crypto2_auditor.size_bin);
            const data = new Uint8Array([1, 2, 3]);
            const sign = await signer.sign(data);
            $mol_assert_equal(sign.byteLength, $mol_crypto2_signer.size_sign);
        },
        async 'verify self signed with auto generated key'() {
            const Alice = await $$.$mol_crypto2_signer.generate();
            const data = new Uint8Array([1, 2, 3]);
            const sign = await Alice.sign(data);
            $mol_assert_equal(true, await Alice.auditor().verify(data, sign));
        },
        async 'verify signed with str exported auto generated key'() {
            const Alice = await $$.$mol_crypto2_signer.generate();
            const data = new Uint8Array([1, 2, 3]);
            const Bella = $mol_crypto2_signer.from(Alice.toString() + Alice.toStringPrivate());
            const sign = await Bella.sign(data);
            const Catie = $mol_crypto2_auditor.from(Alice.auditor().toString());
            $mol_assert_equal(true, await Catie.verify(data, sign));
            const Diana = $mol_crypto2_auditor.from(Alice.toString());
            $mol_assert_equal(true, await Diana.verify(data, sign));
        },
        async 'verify signed with bin exported auto generated key'() {
            const Alice = await $$.$mol_crypto2_signer.generate();
            const data = new Uint8Array([1, 2, 3]);
            const Bella = $mol_crypto2_signer.from(new Uint8Array([...Alice.asArray(), ...Alice.asArrayPrivate()]));
            const sign = await Bella.sign(data);
            const Catie = $mol_crypto2_auditor.from(Alice.auditor().asArray());
            $mol_assert_equal(true, await Catie.verify(data, sign));
            const Diana = $mol_crypto2_auditor.from(Alice.asArray());
            $mol_assert_equal(true, await Diana.verify(data, sign));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        async 'Sizes'() {
            const secret = $mol_crypto_sacred.make();
            const key = secret.asArray();
            $mol_assert_equal(key.byteLength, $mol_crypto_sacred.size);
            const data = new Uint8Array([1, 2, 3]);
            const salt = $mol_crypto_salt();
            const closed = await secret.encrypt(data, salt);
            $mol_assert_equal(closed.byteLength, $mol_crypto_sacred.size);
            const self_closed = await secret.close(secret, salt);
            $mol_assert_equal(self_closed.byteLength, $mol_crypto_sacred.size);
        },
        async 'Decrypt self encrypted'() {
            const secret = $mol_crypto_sacred.make();
            const data = new Uint8Array([1, 2, 3]);
            const salt = $mol_crypto_salt();
            const closed = await secret.encrypt(data, salt);
            const opened = await secret.decrypt(closed, salt);
            $mol_assert_equal(data, opened);
        },
        async 'Decrypt encrypted with exported key'() {
            const data = new Uint8Array([1, 2, 3]);
            const salt = $mol_crypto_salt();
            const Alice = $mol_crypto_sacred.make();
            const closed = await Alice.encrypt(data, salt);
            const Bob = $mol_crypto_sacred.from(Alice.asArray());
            const opened = await Bob.decrypt(closed, salt);
            $mol_assert_equal(data, opened);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        async 'str & bin sizes'() {
            const cipher = await $$.$mol_crypto2_cipher.generate();
            const socket = cipher.socket();
            $mol_assert_equal(cipher.toStringPrivate().length, $mol_crypto2_cipher.size_str);
            $mol_assert_equal(socket.toString().length, $mol_crypto2_socket.size_str);
            $mol_assert_equal(cipher.asArrayPrivate().length, $mol_crypto2_cipher.size_bin);
            $mol_assert_equal(socket.asArray().length, $mol_crypto2_socket.size_bin);
            const secret = await cipher.secret(socket);
            $mol_assert_equal(secret.byteLength, $mol_crypto2_cipher.size_secret);
        },
        async 'Shared secret from public & private keys'() {
            const A = await $mol_crypto2_cipher.generate();
            const B = await $mol_crypto2_cipher.generate();
            const SA = await A.secret(B.socket());
            const SB = await B.secret(A.socket());
            $mol_assert_equal(SA.asArray(), SB.asArray());
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            async "Signing & encryption"($) {
                const Alice = await $mol_crypto2_private.generate();
                const Bella = await $mol_crypto2_private.generate();
                const secretA = await Alice.cipher().secret(Bella.socket());
                const secretB = await Bella.cipher().secret(Alice.socket());
                $mol_assert_equal(secretA, secretB);
                const data = new Uint8Array([1, 2, 3]);
                const nonce = $mol_crypto2_nonce();
                const closed = await secretA.encrypt(data, nonce);
                const digest = $mol_crypto2_hash(closed);
                const sign = await Alice.signer().sign(digest);
                $mol_assert_equal(true, await Alice.auditor().verify(digest, sign));
                $mol_assert_equal(data, await secretA.decrypt(closed, nonce));
            },
            async "Serial & Deserial"($) {
                const orig = await $mol_crypto2_private.generate();
                const bin = new Uint8Array([...orig.asArray(), ...orig.asArrayPrivate()]);
                const str = orig.toString() + orig.toStringPrivate();
                $mol_assert_equal(orig, $mol_crypto2_private.from(bin), $mol_crypto2_private.from(str));
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        class $giper_baza_auth_mock extends $.$giper_baza_auth {
            static current() {
                return this.from('_7uaNxSijvQDjZ-9a9r22hpcROZwhgBTaWZrcDIMwkU3e6xFHq_7h9-Dfxgif7E_szNlubYXJLUWFNt8x5ko3wb0YsrNPmwb8tahStoyKB_J5_gj8LqmJItGnwJHsGmRs17BgVIMzCEMbNqhiBiz6-dkW9PFWp346RUya2lNHzpk');
            }
            static embryos = [
                '_7bJySpjwMJr-9xpQtl3XIQhiiHIAJ3mJGJ9Z8XJXOMbKLhjUHMrA4RZzmscCgO0c7xnXnw_UFhwhDN7CRHOTca4x_vAJdIvjnNNRkBaYqJJRHBiLn6Cjf1Iv7ZYsHBZQZ72WxwYK8xKs8L3Kokv5RZ-jqBoozqc8JIFI1DWayJM',
                '_zOldFN6un21Kk9V_Z51D84ZJXdDoSfkxZZl5iNdSJ8mN-zcOuKh0tUTajmynoVmYG73krPQXIkIlGLAEwx5n03Fju-SIG0_fENxSNDRH8Pukvibs6nnMDPgXCYRvJi6gL8ZVwedP7LYkwa1qpsaUN7nmjWvhkkgVcVMLYK0Jk7g',
                '_8-GDFlnyEYoMzoeCiH1H7lBLuqMyZ1S_2ZEt0o4YIE4frZ1syTbDar0RqkFzC78BhVCYVykYxDTewnzyq4nEwG3y1Al3BskP59eYuDeaH0UKbBNF407K7kGJrMpJXZtMj0kZdX16E3aKfUmeLp0NL9VWFrAg6QiVQd1jJ5-MU5w',
                '_9GnExCEqMmBM5nBUnfdGBPjYSVHOUjHygAFipsPU0UU8mOgMS9JC8Wwkv0waX-JgfPrI_em3gPznH-2_C9MDcP03zEmIAoLRltMEBftax-lHJ52kciH3GUFAdQ1glc9Ej8ypgYHvfvO5gkQA6q0DhCEcWUPkOok5OvJre6iO358',
                '_y1XB55LywSvOEtuyr_hh3wjRaW7gFW_aebG1eSQFmcFTzFvw50xd9Vft_jXFvP3Cd9T4jL-eIPMizBX9gafRcaW8XDdjaWW6GDCJLeXBSoFQH4PpNjufNT7BaPCZfAwY_12rLEO66Pse1GrzdVHU6wSOciL99w56zQLgzFLHErc',
                '_62jup6y61Rt8SN8Oq1Lzu5GXA_WL7oxoRPkRPQNkiwvKz8z4D2p8g_Qa5QWvBYmFrgBwAZmarD1UJ1ucA_zUQbrgMUBmEiYv7S4AApUa1Obo6r2KQ_70BebGOo_F3lNUtzfNxEnMh4FRLShzu0hLlp6gZyFjW7aZKoqLRXR68bw',
                '_yXB4FEZnF35nrJxHpsiS3YB18ADNOwbrKIYKcXAdpAIjWy6A4-Nx6K44RWNvgnreWlACm6PaaymM6he1TaCAAyS8ouYHqSezBbGRPyKmKVXjcyHYfQ33W3tQvipwLM8YB3VcOAuvRBNaiQLLzPb9saE5HT2cU25EJE34hpAVm6I',
                '_6iVZXF5fD2ztELDFvmhTAJWMRNLBMRv3W6GArqcVLwcCM6WeoqPAySo05cG-XaqXTme0iC3Pzf5jvlHqY1GgAO4qfQcF3EWV66Uw9sYD1T_tu_rmKYjYT5YXyaxtki08r50YHA-Jw4obKcDHt6_sDONANUA7pCYjIeFGt0mv1Zs',
                '_yPV-YZgPu0_edJc3I8o1SUKqUucgYVKlbTrKqVyl3sxjQo3u73nGtQq190q3W_ebhVnQWLC8A4JFhbjWDCTzY8i7shadOvvSEeAfuPqsyK5JERqw-tbJm_0nvR8bShIcXzyrYDIg_ZBU_wNKbFzoCXHmh-CNsuKpb6NyBQPsIrU',
                '_-67MXDuic5c7e4Febc1QuI456bgmfeMnmp3rWcGWzcMIPytythDMqmZISsGGsLVFUOQxsGjm7s3ULV-307L3wd47B4K4BtUhTR5cyKMI4y5Ld-UstbevtgOURqLsc_XIhyFilGTJ8ORTRW7RI3O83xtRu-_0lRg9WcmnhWERBIU',
            ];
        }
        __decorate([
            $mol_mem
        ], $giper_baza_auth_mock, "current", null);
        $.$giper_baza_auth = $giper_baza_auth_mock;
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'ordered links'() {
            var graph = new $mol_graph();
            graph.link('A', 'B', 'E');
            $mol_assert_equal(graph.edge_out('A', 'B'), 'E');
            $mol_assert_equal(graph.edge_in('B', 'A'), 'E');
            $mol_assert_equal(graph.edge_out('B', 'A'), null);
            $mol_assert_equal(graph.edge_in('A', 'B'), null);
        },
        'nodes without edges'() {
            var graph = new $mol_graph();
            graph.nodes.add('A');
            graph.nodes.add('B');
            graph.nodes.add('C');
            graph.nodes.add('D');
            graph.acyclic(edge => 0);
            $mol_assert_equal([...graph.sorted].join(''), 'ABCD');
        },
        'partial ordering'() {
            var graph = new $mol_graph();
            graph.nodes.add('A');
            graph.nodes.add('B');
            graph.nodes.add('C');
            graph.nodes.add('D');
            graph.link('B', 'C', { priority: 0 });
            graph.acyclic(edge => edge.priority);
            $mol_assert_equal([...graph.sorted].join(''), 'ACBD');
        },
        'sorting must cut cycles at low priority edges A'() {
            var graph = new $mol_graph();
            graph.link('A', 'B', { priority: 0 });
            graph.link('B', 'C', { priority: -2 });
            graph.link('C', 'D', { priority: 0 });
            graph.link('D', 'A', { priority: -1 });
            graph.acyclic(edge => edge.priority);
            $mol_assert_equal([...graph.sorted].join(''), 'BADC');
        },
        'sorting must cut cycles at low priority edges B'() {
            var graph = new $mol_graph();
            graph.link('B', 'C', { priority: -2 });
            graph.link('C', 'D', { priority: 0 });
            graph.link('D', 'A', { priority: -1 });
            graph.link('A', 'B', { priority: 0 });
            graph.acyclic(edge => edge.priority);
            $mol_assert_equal([...graph.sorted].join(''), 'BADC');
        },
        'sorting must cut cycles at low priority edges C'() {
            var graph = new $mol_graph();
            graph.link('C', 'D', { priority: 0 });
            graph.link('D', 'A', { priority: -1 });
            graph.link('A', 'B', { priority: 0 });
            graph.link('B', 'C', { priority: -2 });
            graph.acyclic(edge => edge.priority);
            $mol_assert_equal([...graph.sorted].join(''), 'BADC');
        },
        'sorting must cut cycles at low priority edges D'() {
            var graph = new $mol_graph();
            graph.link('D', 'A', { priority: -1 });
            graph.link('A', 'B', { priority: 0 });
            graph.link('B', 'C', { priority: -2 });
            graph.link('C', 'D', { priority: 0 });
            graph.acyclic(edge => edge.priority);
            $mol_assert_equal([...graph.sorted].join(''), 'BADC');
        },
        'sorting must group cutted cycles'() {
            var graph = new $mol_graph();
            graph.link('A', 'B', 0);
            graph.link('B', 'C', 0);
            graph.link('C', 'D', -2);
            graph.link('D', 'E', 0);
            graph.link('E', 'C', 0);
            graph.acyclic(edge => edge);
            $mol_assert_equal([...graph.sorted].join(''), 'CEDBA');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'parse and serial'() {
            $mol_assert_equal(new $mol_time_duration('P42.1Y').toString(), 'P42.1YT');
            $mol_assert_equal(new $mol_time_duration('P42.1M').toString(), 'P42.1MT');
            $mol_assert_equal(new $mol_time_duration('P42.1D').toString(), 'P42.1DT');
            $mol_assert_equal(new $mol_time_duration('PT42.1h').toString(), 'PT42.1H');
            $mol_assert_equal(new $mol_time_duration('PT42.1m').toString(), 'PT42.1M');
            $mol_assert_equal(new $mol_time_duration('PT42.1s').toString(), 'PT42.1S');
            $mol_assert_equal(new $mol_time_duration('P1Y2M3DT4h5m6.7s').toString(), 'P1Y2M3DT4H5M6.7S');
        },
        'negatives'() {
            $mol_assert_equal(new $mol_time_duration('P-1Y-2M-3DT-4h-5m-6.7s').toString(), new $mol_time_duration('-P1Y2M3DT4h5m6.7s').toString(), 'P-1Y-2M-3DT-4H-5M-6.7S');
            $mol_assert_equal(new $mol_time_duration('-P-1Y-2M-3DT-4h-5m-6.7s').toString(), 'P1Y2M3DT4H5M6.7S');
        },
        'format typed'() {
            $mol_assert_equal(new $mol_time_duration('P1Y2M3DT4h5m6s').toString('P#Y#M#DT#h#m#s'), 'P1Y2M3DT4H5M6S');
        },
        'format readable'() {
            $mol_assert_equal(new $mol_time_duration('P1Y2M3DT4h5m6s').toString('hh:mm:ss.sss'), '04:05:06.000');
        },
        'normalization'() {
            $mol_assert_equal(new $mol_time_duration('P1Y2M3DT44h55m66s').normal.toString(), 'P1Y2M4DT20H56M6S');
            $mol_assert_equal(new $mol_time_duration('P-1Y-2M-3DT-44h-55m-66s').normal.toString(), 'P-1Y-2M-4DT-20H-56M-6S');
        },
        'comparison'() {
            const iso = 'P1Y1M1DT1h1m1s';
            $mol_assert_equal(new $mol_time_duration(iso), new $mol_time_duration(iso));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'parse and serial'() {
            $mol_assert_equal(new $mol_time_moment('2014').toString(), '2014');
            $mol_assert_equal(new $mol_time_moment('2014-01').toString(), '2014-01');
            $mol_assert_equal(new $mol_time_moment('2014-01-02').toString(), '2014-01-02');
            $mol_assert_equal(new $mol_time_moment('2014-01-02T03').toString(), '2014-01-02T03');
            $mol_assert_equal(new $mol_time_moment('2014-01-02T03:04').toString(), '2014-01-02T03:04');
            $mol_assert_equal(new $mol_time_moment('2014-01-02T03:04:05').toString(), '2014-01-02T03:04:05');
            $mol_assert_equal(new $mol_time_moment('2014-01-02T03:04:05.006').toString(), '2014-01-02T03:04:05.006');
            $mol_assert_equal(new $mol_time_moment('2014-01-02T03:04:05.006Z').toString(), '2014-01-02T03:04:05.006+00:00');
            $mol_assert_equal(new $mol_time_moment('2014-01-02T03:04:05.006+07:00').toString(), '2014-01-02T03:04:05.006+07:00');
            $mol_assert_equal(new $mol_time_moment('2014-01-02T03:04:05+07:08').toString(), '2014-01-02T03:04:05+07:08');
            $mol_assert_equal(new $mol_time_moment('2014-01-02T03:04+07:08').toString(), '2014-01-02T03:04+07:08');
            $mol_assert_equal(new $mol_time_moment('T03:04+07:08').toString(), 'T03:04+07:08');
            $mol_assert_equal(new $mol_time_moment('T03:04:05').toString(), 'T03:04:05');
            $mol_assert_equal(new $mol_time_moment('T03:04').toString(), 'T03:04');
            $mol_assert_equal(new $mol_time_moment('T03').toString(), 'T03');
        },
        'format simple'() {
            $mol_assert_equal(new $mol_time_moment('2014-01-02T01:02:03.000000').toString('AD YY-M-D h:m:s'), '21 14-1-2 1:2:3');
        },
        'format padded'() {
            $mol_assert_equal(new $mol_time_moment('2014-01-02T01:02:03.000').toString('YYYY-MM-DD hh:mm:ss'), '2014-01-02 01:02:03');
        },
        'format time zone'() {
            $mol_assert_equal(new $mol_time_moment('2014-01-02T01:02:03+05:00').toString('Z'), '+05:00');
        },
        'format names'() {
            new $mol_time_moment('2014-01-02T01:02:03.000').toString('Month Mon | WeekDay WD');
        },
        'shifting'() {
            $mol_assert_equal(new $mol_time_moment('T15:54:58.243+03:00').shift({}).toString(), 'T15:54:58.243+03:00');
            $mol_assert_equal(new $mol_time_moment('2014-01-02').shift('P1Y').toString(), '2015-01-02');
            $mol_assert_equal(new $mol_time_moment('2014-01-02').shift('P12M').toString(), '2015-01-02');
            $mol_assert_equal(new $mol_time_moment('2014-01-02').shift('P365D').toString(), '2015-01-02');
            $mol_assert_equal(new $mol_time_moment('2014-01-02').shift('PT8760h').toString(), '2015-01-02');
            $mol_assert_equal(new $mol_time_moment('2014-01').shift('PT8760h').toString(), '2015-01');
            $mol_assert_equal(new $mol_time_moment('2014-01').shift('PT-8760h').toString(), '2013-01');
        },
        'native from reduced'() {
            $mol_assert_equal(new $mol_time_moment('T15:00').native.toISOString().slice(0, -5), new $mol_time_moment().merge('T15:00:00').toOffset('Z').toString().slice(0, -6));
        },
        'normalization'() {
            $mol_assert_equal(new $mol_time_moment({ year: 2015, month: 6, day: 34 }).normal.toString(), '2015-08-04');
            $mol_assert_equal(new $mol_time_moment('2024-09-30 19:00+03:00').normal.month, 8);
        },
        'renormalization'() {
            $mol_assert_equal(new $mol_time_moment('2024-08').normal.toString(), '2024-08');
            $mol_assert_equal(new $mol_time_moment('2024-11').normal.toString(), '2024-11');
        },
        'iso week day'() {
            $mol_assert_equal(new $mol_time_moment('2017-09-17').weekday, $mol_time_moment_weekdays.sunday);
            $mol_assert_equal(new $mol_time_moment('2017-09-18').weekday, $mol_time_moment_weekdays.monday);
        },
        'change offset'() {
            $mol_assert_equal(new $mol_time_moment('2021-04-10 +03:00').toOffset('Z').toString(), '2021-04-09T21:00:00+00:00');
        },
        'comparison'() {
            const iso = '2021-01-02T03:04:05.678+09:10';
            $mol_assert_equal(new $mol_time_moment(iso), new $mol_time_moment(iso));
        },
        'array keeps zero offset'() {
            const moment = new $mol_time_moment('2026-01-25T16:37:36.129+00:00');
            const restored = new $mol_time_moment(moment.toArray());
            $mol_assert_equal(restored.offset?.count('PT1m'), 0);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Is number'() {
            $mol_data_number(0);
        },
        'Is not number'() {
            $mol_assert_fail(() => {
                $mol_data_number('x');
            }, 'x is not a number');
        },
        'Is object number'() {
            $mol_assert_fail(() => {
                $mol_data_number(new Number(''));
            }, '0 is not a number');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Is integer'() {
            $mol_data_integer(0);
        },
        'Is float'() {
            $mol_assert_fail(() => {
                $mol_data_integer(1.1);
            }, '1.1 is not an integer');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'tagged typing'() {
            const { Weight, Length } = $mol_data_tagged({
                Weight: $mol_data_integer,
                Length: $mol_data_integer,
            });
            Length(20); // Validate
            let len = Length(10); // Inferred type
            len = 20; // Explicit type
            let num = len; // Implicit cast
            len = Length(Weight(20)); // Explicit cast
            // len = 20 // Compile time error
            // len = Weight( 20 ) // Compile time error
            // len = Length( 20.1 ) // Run time error
        },
    });
})($ || ($ = {}));

;
"use strict";

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'config by value'() {
            const N = $mol_data_setup((a) => a, 5);
            $mol_assert_equal(N.config, 5);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'function'() {
            $mol_assert_not($mol_func_is_class(function () { }));
        },
        'generator'() {
            $mol_assert_not($mol_func_is_class(function* () { }));
        },
        'async'() {
            $mol_assert_not($mol_func_is_class(async function () { }));
        },
        'arrow'() {
            $mol_assert_not($mol_func_is_class(() => null));
        },
        'named class'() {
            $mol_assert_ok($mol_func_is_class(class Foo {
            }));
        },
        'unnamed class'() {
            $mol_assert_ok($mol_func_is_class(class {
            }));
        },
    });
})($ || ($ = {}));

;
"use strict";

;
"use strict";
var $;
(function ($) {
    $mol_test({
        // @todo enable on strict
        // 'no functions'() {
        // 	const stringify = $mol_data_pipe()
        // 	type Type = $mol_type_assert<
        // 		typeof stringify,
        // 		( input : never )=> never
        // 	>
        // },
        'single function'() {
            const stringify = $mol_data_pipe((input) => input.toString());
            $mol_assert_equal(stringify(5), '5');
        },
        'two functions'() {
            const isLong = $mol_data_pipe((input) => input.toString(), (input) => input.length > 2);
            $mol_assert_equal(isLong(5.0), false);
            $mol_assert_equal(isLong(5.1), true);
        },
        'three functions'() {
            const pattern = $mol_data_pipe((input) => input.toString(), (input) => new RegExp(input), (input) => input.toString());
            $mol_assert_equal(pattern(5), '/5/');
        },
        'classes'() {
            class Box {
                value;
                constructor(value) {
                    this.value = value;
                }
            }
            const boxify = $mol_data_pipe((input) => input.toString(), Box);
            $mol_assert_ok(boxify(5) instanceof Box);
            $mol_assert_like(boxify(5).value, '5');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'Watch one value'($) {
            class App extends $mol_object2 {
                static $ = $;
                static dict = new $mol_wire_dict();
                static lucky() {
                    return this.dict.get(777);
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "lucky", null);
            $mol_assert_equal(App.lucky(), undefined);
            App.dict.set(666, 6666);
            $mol_assert_equal(App.lucky(), undefined);
            App.dict.set(777, 7777);
            $mol_assert_equal(App.lucky(), 7777);
            App.dict.delete(777);
            $mol_assert_equal(App.lucky(), undefined);
        },
        'Watch item channel'($) {
            class App extends $mol_object2 {
                static $ = $;
                static dict = new $mol_wire_dict();
                static lucky() {
                    return this.dict.item(777);
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "lucky", null);
            $mol_assert_equal(App.lucky(), null);
            App.dict.item(666, 6666);
            $mol_assert_equal(App.lucky(), null);
            App.dict.item(777, 7777);
            $mol_assert_equal(App.lucky(), 7777);
            App.dict.item(777, null);
            $mol_assert_equal(App.lucky(), null);
        },
        'Watch size'($) {
            class App extends $mol_object2 {
                static $ = $;
                static dict = new $mol_wire_dict();
                static size() {
                    return this.dict.size;
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "size", null);
            $mol_assert_equal(App.size(), 0);
            App.dict.set(666, 6666);
            $mol_assert_equal(App.size(), 1);
            App.dict.set(777, 7777);
            $mol_assert_equal(App.size(), 2);
            App.dict.delete(777);
            $mol_assert_equal(App.size(), 1);
        },
        'Watch for-of'($) {
            class App extends $mol_object2 {
                static $ = $;
                static dict = new $mol_wire_dict();
                static sum() {
                    let keys = 0;
                    let vals = 0;
                    for (const [key, val] of this.dict) {
                        keys += key;
                        vals += val;
                    }
                    return [keys, vals];
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "sum", null);
            $mol_assert_like(App.sum(), [0, 0]);
            App.dict.set(111, 1111);
            $mol_assert_like(App.sum(), [111, 1111]);
            App.dict.set(222, 2222);
            $mol_assert_like(App.sum(), [333, 3333]);
            App.dict.delete(111);
            $mol_assert_like(App.sum(), [222, 2222]);
        },
        'Watch forEach'($) {
            class App extends $mol_object2 {
                static $ = $;
                static dict = new $mol_wire_dict();
                static sum() {
                    let keys = 0;
                    let vals = 0;
                    this.dict.forEach((val, key) => {
                        keys += key;
                        vals += val;
                    });
                    return [keys, vals];
                }
            }
            __decorate([
                $mol_wire_solo
            ], App, "sum", null);
            $mol_assert_like(App.sum(), [0, 0]);
            App.dict.set(111, 1111);
            $mol_assert_like(App.sum(), [111, 1111]);
            App.dict.set(222, 2222);
            $mol_assert_like(App.sum(), [333, 3333]);
            App.dict.delete(111);
            $mol_assert_like(App.sum(), [222, 2222]);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Empty release"($) {
                const pool = new $mol_memory_pool;
                $mol_assert_equal(pool.empty(), true);
                pool.release(0, 0);
                $mol_assert_equal(pool.acquire(8), 0);
                $mol_assert_equal(pool.empty(), false);
                pool.release(0, 8);
                $mol_assert_equal(pool.empty(), true);
            },
            "linear allocation"($) {
                const pool = new $mol_memory_pool;
                $mol_assert_equal(pool.acquire(8), 0);
                $mol_assert_equal(pool.acquire(16), 8);
                $mol_assert_equal(pool.acquire(32), 24);
            },
            "allocation in released"($) {
                const pool = new $mol_memory_pool;
                $mol_assert_equal(pool.acquire(8), 0);
                $mol_assert_equal(pool.acquire(16), 8);
                pool.release(0, 16);
                $mol_assert_equal(pool.acquire(8), 0);
                $mol_assert_equal(pool.acquire(16), 24);
                $mol_assert_equal(pool.acquire(8), 8);
            },
            "space limitation"($) {
                const pool = new $mol_memory_pool(10);
                pool.acquire(8);
                pool.release(2, 4);
                $mol_assert_fail(() => pool.acquire(6), 'No free space\nneed: 6\nhave: 4');
            },
            "double release"($) {
                const pool = new $mol_memory_pool;
                $mol_assert_fail(() => pool.release(0, 2), 'Double release');
                $mol_assert_fail(() => pool.release(2, 2), 'Release out of allocated');
                pool.acquire(16);
                pool.release(4, 8);
                $mol_assert_fail(() => pool.release(4, 8), 'Double release');
                $mol_assert_fail(() => pool.release(10, 4), 'Double release');
                $mol_assert_fail(() => pool.release(2, 4), 'Double release');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "faces serial and parse"($) {
                const land1 = new $giper_baza_link('12345678_12345678');
                const land2 = new $giper_baza_link('87654321_87654321');
                const land3 = new $giper_baza_link('87654321_00000000');
                const peer1 = new $giper_baza_link('12345678');
                const peer2 = new $giper_baza_link('87654321');
                const faces1 = new $giper_baza_face_map;
                faces1.peer_time(peer1.str, $giper_baza_time_now(), 0);
                faces1.peer_summ(peer1.str, 0);
                faces1.peer_time(peer2.str, $giper_baza_time_now(), 0);
                faces1.peer_summ(peer2.str, 64_000);
                const faces2 = new $giper_baza_face_map;
                faces2.peer_time(peer1.str, $giper_baza_time_now(), 0);
                faces2.peer_summ(peer1.str, 1);
                faces2.peer_time(peer2.str, $giper_baza_time_now(), 1);
                const faces3 = new $giper_baza_face_map;
                const parts = [
                    [land1.str, new $giper_baza_pack_part([], faces1)],
                    [land2.str, new $giper_baza_pack_part([], faces2)],
                    [land3.str, new $giper_baza_pack_part([], faces3)],
                ];
                const pack = $giper_baza_pack.make(parts);
                $mol_assert_equal(parts, pack.parts());
            },
            "units serial and parse"($) {
                const land = new $giper_baza_link('12345678_12345678');
                const pass = $.$giper_baza_auth.grab().pass();
                const gift = $giper_baza_unit_gift.make();
                const sand_small = $giper_baza_unit_sand.make(5);
                const ball = new Uint8Array($giper_baza_unit_sand.size_equator + 5);
                const sand_big = $giper_baza_unit_sand.make(ball.byteLength);
                sand_big.ball(ball);
                const seal = $giper_baza_unit_seal.make(15, true);
                const parts = [
                    [land.str, new $giper_baza_pack_part([pass, gift, sand_small, sand_big, seal])],
                ];
                const pack = $giper_baza_pack.make(parts);
                $mol_assert_equal(parts, pack.parts());
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'triplets'() {
            $mol_assert_equal(new $mol_time_interval('2015-01-01/P1M').end.toString(), '2015-02-01');
            $mol_assert_equal(new $mol_time_interval('P1M/2015-02-01').start.toString(), '2015-01-01');
            $mol_assert_equal(new $mol_time_interval('2015-01-01/2015-02-01').duration.toString(), 'PT2678400S');
        },
        'comparison'() {
            const iso = '2021-01-02/2022-03-04';
            $mol_assert_like(new $mol_time_interval(iso), new $mol_time_interval(iso));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'span for same uri'($) {
            const span = new $mol_span('test.ts', '', 1, 3, 4);
            const child = span.span(4, 5, 8);
            $mol_assert_equal(child.uri, 'test.ts');
            $mol_assert_equal(child.row, 4);
            $mol_assert_equal(child.col, 5);
            $mol_assert_equal(child.length, 8);
        },
        'span after of given position'($) {
            const span = new $mol_span('test.ts', '', 1, 3, 4);
            const child = span.after(11);
            $mol_assert_equal(child.uri, 'test.ts');
            $mol_assert_equal(child.row, 1);
            $mol_assert_equal(child.col, 7);
            $mol_assert_equal(child.length, 11);
        },
        'slice span - regular'($) {
            const span = new $mol_span('test.ts', '', 1, 3, 5);
            const child = span.slice(1, 4);
            $mol_assert_equal(child.row, 1);
            $mol_assert_equal(child.col, 4);
            $mol_assert_equal(child.length, 3);
            const child2 = span.slice(2, 2);
            $mol_assert_equal(child2.col, 5);
            $mol_assert_equal(child2.length, 0);
        },
        'slice span - negative'($) {
            const span = new $mol_span('test.ts', '', 1, 3, 5);
            const child = span.slice(-3, -1);
            $mol_assert_equal(child.row, 1);
            $mol_assert_equal(child.col, 5);
            $mol_assert_equal(child.length, 2);
        },
        'slice span - out of range'($) {
            const span = new $mol_span('test.ts', '', 1, 3, 5);
            $mol_assert_fail(() => span.slice(-1, 3), `End value '3' can't be less than begin value (test.ts#1:3/5)`);
            $mol_assert_fail(() => span.slice(1, 6), `End value '6' out of range (test.ts#1:3/5)`);
            $mol_assert_fail(() => span.slice(1, 10), `End value '10' out of range (test.ts#1:3/5)`);
        },
        'error handling'($) {
            const span = new $mol_span('test.ts', '', 1, 3, 4);
            const error = span.error('Some error');
            $mol_assert_equal(error.message, 'Some error (test.ts#1:3/4)');
        }
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'tree parsing'($) {
            $mol_assert_equal($.$mol_tree2_from_string("foo\nbar\n").kids.length, 2);
            $mol_assert_equal($.$mol_tree2_from_string("foo\nbar\n").kids[1].type, "bar");
            $mol_assert_equal($.$mol_tree2_from_string("foo\n\n\n").kids.length, 1);
            $mol_assert_equal($.$mol_tree2_from_string("=foo\n\\bar\n").kids.length, 2);
            $mol_assert_equal($.$mol_tree2_from_string("=foo\n\\bar\n").kids[1].value, "bar");
            $mol_assert_equal($.$mol_tree2_from_string("foo bar \\pol\n").kids[0].kids[0].kids[0].value, "pol");
            $mol_assert_equal($.$mol_tree2_from_string("foo bar\n\t\\pol\n\t\\men\n").kids[0].kids[0].kids[1].value, "men");
            $mol_assert_equal($.$mol_tree2_from_string('foo bar \\text\n').toString(), 'foo bar \\text\n');
        },
        'Too many tabs'($) {
            const tree = `
				foo
						bar
			`;
            $mol_assert_fail(() => {
                $.$mol_tree2_from_string(tree, 'test');
            }, 'Too many tabs\ntest#3:1/6\n!!!!!!\n\t\t\t\t\t\tbar');
        },
        'Too few tabs'($) {
            const tree = `
					foo
				bar
			`;
            $mol_assert_fail(() => {
                $.$mol_tree2_from_string(tree, 'test');
            }, 'Too few tabs\ntest#3:1/4\n!!!!\n\t\t\t\tbar');
        },
        'Wrong nodes separator at start'($) {
            const tree = `foo\n \tbar\n`;
            $mol_assert_fail(() => {
                $.$mol_tree2_from_string(tree, 'test');
            }, 'Wrong nodes separator\ntest#2:1/2\n!!\n \tbar');
        },
        'Wrong nodes separator in the middle'($) {
            const tree = `foo  bar\n`;
            $mol_assert_fail(() => {
                $.$mol_tree2_from_string(tree, 'test');
            }, 'Wrong nodes separator\ntest#1:5/1\n    !\nfoo  bar');
        },
        'Unexpected EOF, LF required'($) {
            const tree = `	foo`;
            $mol_assert_fail(() => {
                $.$mol_tree2_from_string(tree, 'test');
            }, 'Unexpected EOF, LF required\ntest#1:5/1\n	   !\n	foo');
        },
        'Errors skip and collect'($) {
            const tree = `foo  bar`;
            const errors = [];
            const $$ = $.$mol_ambient({
                $mol_fail: (error) => {
                    errors.push(error.message);
                    return null;
                }
            });
            const res = $$.$mol_tree2_from_string(tree, 'test');
            $mol_assert_like(errors, [
                'Wrong nodes separator\ntest#1:5/1\n    !\nfoo  bar',
                'Unexpected EOF, LF required\ntest#1:9/1\n        !\nfoo  bar',
            ]);
            $mol_assert_equal(res.toString(), 'foo bar\n');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    function check(tree, ideal) {
        $mol_assert_equal(tree.toString(), $$.$mol_tree2_from_string(ideal).toString());
    }
    $mol_test({
        'inserting'($) {
            check($.$mol_tree2_from_string(`
					a b c d
				`).insert($mol_tree2.struct('x'), 'a', 'b', 'c'), `
					a b x
				`);
            check($.$mol_tree2_from_string(`
					a b
				`).insert($mol_tree2.struct('x'), 'a', 'b', 'c', 'd'), `
					a b c x
				`);
            check($.$mol_tree2_from_string(`
					a b c d
				`)
                .insert($mol_tree2.struct('x'), 0, 0, 0), `
					a b x
				`);
            check($.$mol_tree2_from_string(`
					a b
				`)
                .insert($mol_tree2.struct('x'), 0, 0, 0, 0), `
					a b \\
						x
				`);
            check($.$mol_tree2_from_string(`
					a b c d
				`)
                .insert($mol_tree2.struct('x'), null, null, null), `
					a b x
				`);
            check($.$mol_tree2_from_string(`
					a b
				`)
                .insert($mol_tree2.struct('x'), null, null, null, null), `
					a b \\
						x
				`);
        },
        'updating'($) {
            check($.$mol_tree2_from_string(`
					a b c d
				`).update([], 'a', 'b', 'c')[0], `
					a b
				`);
            check($.$mol_tree2_from_string(`
					a b c d
				`).update([$mol_tree2.struct('x')])[0], `
					x
				`);
            check($.$mol_tree2_from_string(`
					a b c d
				`).update([$mol_tree2.struct('x'), $mol_tree2.struct('y')], 'a', 'b', 'c')[0], `
					a b
						x
						y
				`);
        },
        'deleting'($) {
            const base = $.$mol_tree2_from_string(`
				a b c d
			`);
            check(base.insert(null, 'a', 'b', 'c'), `
					a b
				`);
            check(base.update(base.select('a', 'b', 'c', null).kids, 'a', 'b', 'c')[0], `
					a b d
				`);
            check(base.insert(null, 0, 0, 0), `
					a b
				`);
        },
        'hack'($) {
            const res = $.$mol_tree2_from_string(`
				foo bar xxx
			`)
                .hack({
                'bar': (input, belt) => [input.struct('777', input.hack(belt))],
            });
            $mol_assert_equal(res.map(String), ['foo 777 xxx\n']);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "1 byte int"($) {
                $mol_assert_equal($mol_bigint_encode(0n), new Uint8Array(new Int8Array([0]).buffer));
                $mol_assert_equal($mol_bigint_encode(1n), new Uint8Array(new Int8Array([1]).buffer));
                $mol_assert_equal($mol_bigint_encode(-1n), new Uint8Array(new Int8Array([-1]).buffer));
                $mol_assert_equal($mol_bigint_encode(127n), new Uint8Array(new Int8Array([127]).buffer));
                $mol_assert_equal($mol_bigint_encode(-128n), new Uint8Array(new Int8Array([-128]).buffer));
            },
            "2 byte int"($) {
                $mol_assert_equal($mol_bigint_encode(128n), new Uint8Array(new Int16Array([128]).buffer));
                $mol_assert_equal($mol_bigint_encode(-129n), new Uint8Array(new Int16Array([-129]).buffer));
                $mol_assert_equal($mol_bigint_encode(128n * 256n - 1n), new Uint8Array(new Int16Array([128 * 256 - 1]).buffer));
                $mol_assert_equal($mol_bigint_encode(-128n * 256n), new Uint8Array(new Int16Array([-128 * 256]).buffer));
            },
            "3 byte int"($) {
                $mol_assert_equal($mol_bigint_encode(128n * 256n), new Uint8Array(new Int32Array([128 * 256]).buffer).slice(0, 3));
                $mol_assert_equal($mol_bigint_encode(-128n * 256n - 1n), new Uint8Array(new Int32Array([-128 * 256 - 1]).buffer).slice(0, 3));
                $mol_assert_equal($mol_bigint_encode(128n * 256n ** 2n - 1n), new Uint8Array(new Int32Array([128 * 256 ** 2 - 1]).buffer).slice(0, 3));
                $mol_assert_equal($mol_bigint_encode(-128n * 256n ** 2n), new Uint8Array(new Int32Array([-128 * 256 ** 2]).buffer).slice(0, 3));
            },
            "4 byte int"($) {
                $mol_assert_equal($mol_bigint_encode(128n * 256n ** 2n), new Uint8Array(new Int32Array([128 * 256 ** 2]).buffer));
                $mol_assert_equal($mol_bigint_encode(-128n * 256n ** 2n - 1n), new Uint8Array(new Int32Array([-128 * 256 ** 2 - 1]).buffer));
                $mol_assert_equal($mol_bigint_encode(128n * 256n ** 3n - 1n), new Uint8Array(new Int32Array([128 * 256 ** 3 - 1]).buffer));
                $mol_assert_equal($mol_bigint_encode(-128n * 256n ** 3n), new Uint8Array(new Int32Array([-128 * 256 ** 3]).buffer));
            },
            "8 byte int"($) {
                $mol_assert_equal($mol_bigint_encode(128n * 256n ** 7n - 1n), new Uint8Array(new BigInt64Array([128n * 256n ** 7n - 1n]).buffer));
                $mol_assert_equal($mol_bigint_encode(-128n * 256n ** 7n), new Uint8Array(new BigInt64Array([-128n * 256n ** 7n]).buffer));
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        function check(text, bytes) {
            const ideal = new Uint8Array(bytes);
            const actual = $mol_charset_ucf_encode(text);
            $mol_assert_equal($mol_charset_ucf_decode(actual), text);
            $mol_assert_equal(actual, ideal);
        }
        $mol_test({
            "Full ASCII compatible"($) {
                check('hi', [0x68, 0x69]);
            },
            "1B ASCII with diacritic"($) {
                check('allo\u0302', [0x61, 0x6C, 0x6C, 0x6F, 0xEA]);
            },
            "1B Cyrillic"($) {
                check('мир', [0x88, 0x3C, 0xE2, 0x40, 0xF8]);
            },
            "1B Cyrillic with nummbers and punctuation"($) {
                check('м.1', [0x88, 0x3C, 0x2E, 0x31, 0xF8]);
            },
            "2B Kanji"($) {
                check('美', [0xF9, 0x0E, 0x63, 0x87]);
            },
            "3B rare Kanji"($) {
                check('𲎯', [0xF7, 0x2F, 0x47, 0x0C, 0x89]);
            },
            "1B Kana"($) {
                check('しい', [0xE0, 0x57, 0x44, 0xA0]);
            },
            "2B Emoji"($) {
                check('🏴', [0xFF, 0x74, 0x4B, 0x81]);
            },
            "2B Emoji with 1B modifiers"($) {
                check('🏴‍☠', [0xFF, 0x74, 0x4B, 0xC1, 0x0D, 0x8C, 0xA9, 0xB4]);
            },
            "2B Emoji with 3B Tag"($) {
                check('🏴\u{E007F}', [0xFF, 0x74, 0x4B, 0xF8, 0x7F, 0x00, 0xF3, 0x89]);
            },
            "Mixed scripts"($) {
                check('allô 美しい мир, 🏴‍☠\n', [
                    0x61, 0x6C, 0x6C, 0x6F, 0xEA, 0x20, // allô 
                    0xF9, 0x0E, 0x63, 0xE7, 0x57, 0x44, 0x20, // 美しい 
                    0xA8, 0x3C, 0xE2, 0x40, 0x2C, 0x20, // мир, 
                    0xF7, 0x74, 0x4B, 0xC1, 0x0D, 0x8C, 0xA9, 0x0A, // 🏴‍☠\n
                    0xB4,
                ]);
            },
            "Wrong ending"($) {
                const bin = new Uint8Array([0x88, 0x3C, 0xE2, 0x40]);
                const error = $mol_assert_fail(() => $mol_charset_ucf_decode(bin), 'Wrong ending');
                $mol_assert_equal(error.cause.mode, 166);
                $mol_assert_equal(error.cause.text, 'мир');
            },
            "Wrong byte"($) {
                const bin = new Uint8Array([0xFF, 0x74, 0x4B, 0x74, 0x9B, 0x81]);
                const error = $mol_assert_fail(() => $mol_charset_ucf_decode(bin), 'Wrong byte');
                $mol_assert_equal(error.cause.pos, 4);
                $mol_assert_equal(error.cause.text, '🏴');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "1 byte int"($) {
                $mol_assert_equal($mol_bigint_decode(new Uint8Array), 0n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int8Array([1]).buffer)), 1n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int8Array([-1]).buffer)), -1n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int8Array([127]).buffer)), 127n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int8Array([-128]).buffer)), -128n);
            },
            "2 byte int"($) {
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int16Array([128]).buffer)), 128n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int16Array([-129]).buffer)), -129n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int16Array([128 * 256 - 1]).buffer)), 128n * 256n - 1n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int16Array([-128 * 256]).buffer)), -128n * 256n);
            },
            "3 byte int"($) {
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int32Array([128 * 256]).buffer).slice(0, 3)), 128n * 256n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int32Array([-128 * 256 - 1]).buffer).slice(0, 3)), -128n * 256n - 1n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int32Array([128 * 256 ** 2 - 1]).buffer).slice(0, 3)), 128n * 256n ** 2n - 1n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int32Array([-128 * 256 ** 2]).buffer).slice(0, 3)), -128n * 256n ** 2n);
            },
            "4 byte int"($) {
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int32Array([128 * 256 ** 2]).buffer)), 128n * 256n ** 2n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int32Array([-128 * 256 ** 2 - 1]).buffer)), -128n * 256n ** 2n - 1n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int32Array([128 * 256 ** 3 - 1]).buffer)), 128n * 256n ** 3n - 1n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new Int32Array([-128 * 256 ** 3]).buffer)), -128n * 256n ** 3n);
            },
            "8 byte int"($) {
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new BigInt64Array([128n * 256n ** 7n - 1n]).buffer)), 128n * 256n ** 7n - 1n);
                $mol_assert_equal($mol_bigint_decode(new Uint8Array(new BigInt64Array([-128n * 256n ** 7n]).buffer)), -128n * 256n ** 7n);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Zero int"($) {
                $mol_assert_equal($mol_bigint_decode($mol_bigint_encode(0n)), 0n);
            },
            "Large positive int"($) {
                $mol_assert_equal($mol_bigint_decode($mol_bigint_encode(12345678901234567890n)), 12345678901234567890n);
            },
            "Large negative int"($) {
                $mol_assert_equal($mol_bigint_decode($mol_bigint_encode(-12345678901234567890n)), -12345678901234567890n);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
/** @jsx $mol_jsx */
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        const { uint, link, spec, blob, text, list, tupl, sint } = $mol_vary_tip;
        const { none, both, fp16, fp32, fp64 } = $mol_vary_spec;
        const { L1, L2, L4, L8, LA } = $mol_vary_len;
        const str = $mol_charset_ucf_encode;
        function check(vary, ideal, Vary = $mol_vary) {
            const pack = Vary.pack(vary);
            $mol_assert_equal(Vary.take(pack), vary);
            $mol_assert_equal(pack, new Uint8Array(ideal));
        }
        $mol_test({
            "vary pack logical"($) {
                check([null], [spec | none]);
                check([true], [$mol_vary_spec.true]);
                check([false], [$mol_vary_spec.fake]);
                check([undefined], [spec | both]);
            },
            "vary pack uint0"($) {
                check([0], [0]);
                check([27], [27]);
            },
            "vary pack uint1"($) {
                check([28], [uint | L1, 28]);
                check([255], [uint | L1, 255]);
            },
            "vary pack uint2"($) {
                check([256], [uint | L2, 0, 1]);
                check([256 ** 2 - 1], [uint | L2, 255, 255]);
            },
            "vary pack uint4"($) {
                check([256 ** 2], [uint | L4, 0, 0, 1, 0]);
                check([256 ** 4 - 1], [uint | L4, 255, 255, 255, 255]);
            },
            "vary pack uint8"($) {
                check([256 ** 4], [uint | L8, 0, 0, 0, 0, 1, 0, 0, 0]);
                check([Number.MAX_SAFE_INTEGER], [uint | L8, 255, 255, 255, 255, 255, 255, 31, 0]);
                check([256n ** 8n - 1n], [uint | L8, 255, 255, 255, 255, 255, 255, 255, 255]);
            },
            "vary pack sint0"($) {
                check([-1], [-1]);
                check([-27], [-27]);
            },
            "vary pack sint1"($) {
                check([-28,], [sint | -L1, -28]);
                check([-256 / 2], [sint | -L1, 128]);
            },
            "vary pack sint2"($) {
                check([-256 / 2 - 1], [sint | -L2, 127, 255]);
                check([-(256 ** 2) / 2], [sint | -L2, 0, 128]);
            },
            "vary pack sint4"($) {
                check([-(256 ** 2) / 2 - 1], [sint | -L4, 255, 127, 255, 255]);
                check([-(256 ** 4) / 2], [sint | -L4, 0, 0, 0, 128]);
            },
            "vary pack sint8"($) {
                check([-(256 ** 4) / 2 - 1], [sint | -L8, 255, 255, 255, 127, 255, 255, 255, 255]);
                check([Number.MIN_SAFE_INTEGER], [sint | -L8, 1, 0, 0, 0, 0, 0, 224, 255]);
                check([-(2n ** 63n)], [sint | -L8, 0, 0, 0, 0, 0, 0, 0, 128]);
            },
            "vary pack bigint"($) {
                check([2n ** 64n], [sint | -LA, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
                check([2n ** 2111n], [sint | -LA, 0, 1, ...Array.from({ length: 263 }, () => 0), 128, 0]);
                check([-1n - 2n ** 64n], [sint | -LA, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 254]);
                check([-1n - 2n ** 2111n], [sint | -LA, 0, 1, ...Array.from({ length: 263 }, () => 255), -129, 255]);
            },
            "vary pack float"($) {
                check([1.5], [fp64, ...new Uint8Array(new Float64Array([1.5]).buffer)]);
            },
            "vary pack list"($) {
                check([[1, 2, 3]], [list | 3, 1, 2, 3]);
                check([[[], [1], [2, 3]]], [list | 3, list | 0, list | 1, 1, list | 2, 2, 3]);
            },
            "vary pack dedup list"($) {
                const pair = [1, 2];
                check([[pair, pair]], [list | 2, list | 2, 1, 2, link | 0]);
                const seven = [7];
                const box = [seven];
                check([[box, box, seven]], [list | 3, list | 1, list | 1, 7, link | 1, link | 0]);
            },
            "vary pack cyclic list"($) {
                const foo = [];
                foo.push([foo]);
                $mol_assert_fail(() => $mol_vary.pack([foo]), 'Cyclic refs');
            },
            "vary pack dedup uint"($) {
                check([[28, 28]], [list | 2, uint | L1, 28, link | 0]);
                check([[2n ** 64n, 2n ** 64n]], [list | 2, sint | -LA, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, link | 0]);
            },
            "vary pack dedup float"($) {
                check([[1.5, 1.5]], [list | 2, fp64, ...new Uint8Array(new Float64Array([1.5]).buffer), link | 0]);
            },
            "vary pack text"($) {
                check(['foo'], [text | 3, ...str('foo')]);
                check(['абв'], [text | 5, ...str('абв')]);
                const long_lat = 'abcdefghijklmnopqrst';
                check([long_lat], [text | L1, 20, ...str(long_lat)]);
                const long_cyr = 'абвгдеёжзийклмнопрст';
                check([long_cyr], [text | L1, 22, ...str(long_cyr)]);
            },
            "vary pack dedup text"($) {
                check([["f", "f"]], [list | 2, text | 1, ...str('f'), link | 0]);
            },
            "vary pack blob"($) {
                check([new Uint8Array([1, 255])], [blob | 2, uint | L1, 1, 255]);
                check([new Int8Array([-128, 127])], [blob | 2, sint | ~L1, -128, 127]);
                check([new Uint32Array([255])], [blob | 4, uint | L4, 255, 0, 0, 0]);
                check([new Int32Array([-128])], [blob | 4, sint | ~L4, -128, 255, 255, 255]);
                check([new BigUint64Array([255n])], [blob | 8, uint | L8, 255, 0, 0, 0, 0, 0, 0, 0]);
                check([new BigInt64Array([-128n])], [blob | 8, sint | ~L8, -128, 255, 255, 255, 255, 255, 255, 255]);
                check([new Float32Array([1.5])], [blob | 4, fp32, ...new Uint8Array(new Float32Array([1.5]).buffer)]);
                check([new Float64Array([1.5])], [blob | 8, fp64, ...new Uint8Array(new Float64Array([1.5]).buffer)]);
            },
            "vary pack dedup blob"($) {
                const part = new Uint8Array([1, 2]);
                check([[part, part]], [list | 2, blob | 2, uint | L1, 1, 2, link | 0]);
            },
            "vary pack struct"($) {
                check([{ x: 1, y: 2 }], [tupl | 2, list | 2, text | 1, ...str('x'), text | 1, ...str('y'), 1, 2]);
                check([{ x: {}, y: { a: 1 } }], [tupl | 2, list | 2, text | 1, ...str('x'), text | 1, ...str('y'), tupl | 0, list | 0, tupl | 1, list | 1, text | 1, ...str('a'), 1]);
            },
            "vary pack struct shape dedup"($) {
                check([[{}, { foo: 1 }, { foo: 2 }]], [list | 3, tupl | 0, list | 0, tupl | 1, list | 1, text | 3, ...str('foo'), 1, tupl | 1, link | 3, 2]);
                check([{ x: 1, y: { x: 2, y: 3 } }], [tupl | 2, list | 2, text | 1, ...str('x'), text | 1, ...str('y'), 1, tupl | 2, link | 2, 2, 3]);
            },
            "vary pack struct full dedup"($) {
                const item = { x: 1 };
                check([[item, item]], [list | 2, tupl | 1, list | 1, text | 1, ...str('x'), 1, link | 2]);
                const part = { x: 1, y: 2 };
                check([{ x: part, y: part }], [tupl | 2, list | 2, text | 1, ...str('x'), text | 1, ...str('y'), tupl | 2, link | 2, 1, 2, link | 3]);
            },
            "vary pack cyclic struct"($) {
                const foo = { bar: null };
                foo.bar = foo;
                $mol_assert_fail(() => $mol_vary.pack([foo]), 'Cyclic refs');
            },
            "vary pack Map"($) {
                check([new Map([['foo', 1], [2, 'bar']])], [tupl | 2, list | 2, text | 4, ...str('keys'), text | 4, ...str('vals'), list | 2, text | 3, ...str('foo'), 2, list | 2, 1, text | 3, ...str('bar')]);
            },
            "vary pack Set"($) {
                check([new Set([7, 'foo'])], [tupl | 1, list | 1, text | 3, ...str('set'), list | 2, 7, text | 3, ...str('foo')]);
            },
            "vary pack Date"($) {
                const date1 = new Date('2025-01-02T03:04:05');
                check([date1], [tupl | 1, list | 1, text | 9, ...str('unix_time'), uint | L4, ...new Uint8Array(new Uint32Array([date1.valueOf() / 1000]).buffer)]);
                const date2 = new Date('2025-01-02T03:04:05.678');
                check([date2], [tupl | 1, list | 1, text | 9, ...str('unix_time'), fp64, ...new Uint8Array(new Float64Array([date2.valueOf() / 1000]).buffer)]);
            },
            "vary pack DOM Element"($) {
                $mol_assert_equal($mol_dom_serialize($mol_jsx("div", null,
                    $mol_jsx("span", null),
                    $mol_jsx("br", null),
                    " ")), $mol_dom_serialize($mol_vary.take($mol_vary.pack([$mol_jsx("div", null,
                        $mol_jsx("span", null),
                        $mol_jsx("br", null),
                        " ")]))[0]));
            },
            "vary pack custom types in rooms"($) {
                class Foo {
                    a;
                    b;
                    constructor(a, b) {
                        this.a = a;
                        this.b = b;
                    }
                    ;
                    [Symbol.iterator]() {
                        return [this.a, this.b].values();
                    }
                }
                const Vary = $mol_vary.zone();
                Vary.type({
                    type: Foo,
                    keys: ['summ', 'diff'],
                    lean: foo => [foo.a + foo.b, foo.a - foo.b],
                    rich: ([summ, diff]) => new Foo((summ + diff) / 2, (summ - diff) / 2),
                });
                // restore
                check([new Foo(4, 2)], [tupl | 2, list | 2, text | 4, ...str('summ'), text | 4, ...str('diff'), 6, 2], Vary);
                // isolated
                $mol_assert_equal($mol_vary.take($mol_vary.pack([new Foo(4, 2)])), [{ a: 4, b: 2 }]);
                // inherited
                $mol_assert_equal(Vary.take(Vary.pack([new Map([[1, 2]])])), [new Map([[1, 2]])]);
            },
            "vary pack sequences"($) {
                check([], []);
                check([7], [7]);
                check([3, 4], [3, 4]);
                check([['foo', 'foo'], ['bar', 'bar']], [list | 2, text | 3, ...str('foo'), link | 0, list | 2, text | 3, ...str('bar'), link | 0]);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
/** @jsx $mol_jsx */
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        function check(vary) {
            $mol_assert_equal(vary, $giper_baza_vary.take($giper_baza_vary.pack([vary]))[0]);
        }
        $mol_test({
            "Bin"($) {
                check(null);
                check(new Uint8Array([1, 2, 3]));
            },
            "Bool"($) {
                check(false);
                check(true);
            },
            "Int"($) {
                check(0);
                check(4611686018427387904n);
            },
            "Real"($) {
                check(0);
                check(Math.PI);
                check(Number.NaN);
                check(Number.POSITIVE_INFINITY);
                check(Number.NEGATIVE_INFINITY);
                check(Number.MAX_SAFE_INTEGER);
                check(Number.MIN_SAFE_INTEGER);
                check(BigInt(Number.MAX_VALUE));
                check(Number.MIN_VALUE);
            },
            "Link"($) {
                check(new $giper_baza_link(''));
                check($giper_baza_link.from_int(123456789));
            },
            "Str"($) {
                check('');
                check('123');
                check('🐱‍👤');
            },
            "Time"($) {
                check(new $mol_time_moment('1984-08-04T09:05:13.666+03:00'));
                check(new $mol_time_moment);
            },
            "Dura"($) {
                check(new $mol_time_duration('P1Y2M3DT4h5m6.6s'));
            },
            "Span"($) {
                check(new $mol_time_interval('T09:00/PT9h'));
            },
            "JSON"($) {
                check({ foo: ['bar'] });
                check([{ foo: 'bar' }]);
            },
            "DOM"($) {
                const xml = ($mol_jsx("div", null,
                    $mol_jsx("span", { class: "bar" }, "xxx")));
                $mol_assert_equal($mol_dom_serialize($giper_baza_vary.take($giper_baza_vary.pack([xml]))[0]), $mol_dom_serialize(xml));
            },
            "Tree"($) {
                const tree = $.$mol_tree2_from_string(`
				foo \\bar
					foo \\bar
			`);
                $mol_assert_equal($.$mol_tree2_to_string($giper_baza_vary.take($giper_baza_vary.pack([tree]))[0]), $.$mol_tree2_to_string(tree));
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        class $mol_bus extends $.$mol_bus {
            send() { }
        }
        $.$mol_bus = $mol_bus;
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'empty array'() {
            $mol_assert_equal($mol_array_chunks([], () => true), []);
        },
        'one chunk'() {
            $mol_assert_equal($mol_array_chunks([1, 2, 3, 4, 5], () => false), [[1, 2, 3, 4, 5]]);
        },
        'fixed size chunk'() {
            $mol_assert_equal($mol_array_chunks([1, 2, 3, 4, 5], 3), [[1, 2, 3], [4, 5]]);
        },
        'first empty chunk'() {
            $mol_assert_equal($mol_array_chunks([1, 2, 3, 4, 5], (_, i) => i === 0), [[1, 2, 3, 4, 5]]);
        },
        'chunk for every item'() {
            $mol_assert_equal($mol_array_chunks([1, 2, 3, 4, 5], () => true), [[1], [2], [3], [4], [5]]);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        class $giper_baza_land_mock extends $.$giper_baza_land {
            sync() {
                return this;
            }
        }
        $.$giper_baza_land = $giper_baza_land_mock;
    });
    $mol_test({
        async 'Give rights'($) {
            const auth0 = await $.$giper_baza_auth.generate();
            const auth1 = await $.$giper_baza_auth.generate();
            const auth2 = await $.$giper_baza_auth.generate();
            const land0 = $giper_baza_land.make({ $, auth: () => auth0 });
            const land1 = $giper_baza_land.make({ $, link: () => land0.link(), auth: () => auth1 });
            $mol_assert_equal(land0.lord_rank(land0.link()), $giper_baza_rank_rule);
            $mol_assert_equal(land0.lord_rank(auth1.pass().lord()), $giper_baza_rank_read);
            land1.give(auth2.pass(), $giper_baza_rank_post('just'));
            $mol_assert_equal(land0.pass_rank(auth1.pass()), $giper_baza_rank_read);
            land0.give(auth1.pass(), $giper_baza_rank_read);
            $mol_assert_equal(land0.pass_rank(auth1.pass()), $giper_baza_rank_read);
            land0.give(auth1.pass(), $giper_baza_rank_read);
            $mol_assert_equal(land0.pass_rank(auth1.pass()), $giper_baza_rank_read);
            land0.give(auth1.pass(), $giper_baza_rank_post('just'));
            $mol_assert_equal(land0.pass_rank(auth1.pass()), $giper_baza_rank_post('just'));
            land0.give(auth1.pass(), $giper_baza_rank_pull('just'));
            $mol_assert_equal(land0.pass_rank(auth1.pass()), $giper_baza_rank_pull('just'));
            land0.give(auth1.pass(), $giper_baza_rank_rule);
            $mol_assert_equal(land0.pass_rank(auth1.pass()), $giper_baza_rank_rule);
            land0.give(auth1.pass(), $giper_baza_rank_post('just'));
            $mol_assert_equal(land0.pass_rank(auth1.pass()), $giper_baza_rank_post('just'));
            await $mol_wire_async(land1).units_steal(land0);
            $mol_assert_equal(land1.pass_rank(auth1.pass()), $giper_baza_rank_post('just'));
            land1.give(auth2.pass(), $giper_baza_rank_post('just'));
        },
        async 'Post Data and pick Delta'($) {
            const auth1 = await $.$giper_baza_auth.generate();
            const auth2 = await $.$giper_baza_auth.generate();
            const land1 = $giper_baza_land.make({ $, auth: () => auth1 });
            const land2 = $giper_baza_land.make({ $, link: () => land1.link(), auth: () => auth2 });
            $mol_assert_equal(await $mol_wire_async(land1).diff_units(), []);
            land1.post($giper_baza_link.hole, $giper_baza_link.hole, new $giper_baza_link('AA111111'), new Uint8Array([1]));
            $mol_assert_equal((await $mol_wire_async(land1).diff_units()).length, 4);
            const face = land1.faces.clone();
            land1.post(new $giper_baza_link('AA111111'), $giper_baza_link.hole, new $giper_baza_link('AA222222'), new Uint8Array([2]));
            $mol_assert_equal((await $mol_wire_async(land1).diff_units()).length, 5);
            $mol_assert_equal((await $mol_wire_async(land1).diff_units(face)).length, 2);
            await $mol_wire_async(land2).units_steal(land1);
            land2.post(new $giper_baza_link('AA222222'), $giper_baza_link.hole, new $giper_baza_link('AA333333'), new Uint8Array([3]));
            $mol_assert_equal((await $mol_wire_async(land2).diff_units()).length, 5);
            $mol_assert_equal((await $mol_wire_async(land2).diff_units(face)).length, 2);
            land1.give(auth2.pass(), $giper_baza_rank_post('just'));
            await $mol_wire_async(land2).units_steal(land1);
            land2.post(new $giper_baza_link('AA222222'), $giper_baza_link.hole, new $giper_baza_link('AA333333'), new Uint8Array([5]));
            $mol_assert_equal((await $mol_wire_async(land2).diff_units()).length, 9);
            $mol_assert_equal((await $mol_wire_async(land2).diff_units(face)).length, 6);
            land1.give(auth2.pass(), $giper_baza_rank_read);
            await $mol_wire_async(land2).units_steal(land1);
            $mol_assert_equal((await $mol_wire_async(land2).diff_units()).length, 7);
        },
        async 'Land encryption'($) {
            const land = $mol_wire_async($giper_baza_land.make({ $ }));
            $mol_assert_equal(await land.encrypted(), false);
            await land.encrypted(true);
            $mol_assert_equal(await land.encrypted(), true);
            const material = await land.post($giper_baza_link.hole, $giper_baza_link.hole, null, new Uint8Array([1, 2, 3]));
            $mol_assert_equal((await land.sand_encode(material)).data().length, 16);
            $mol_assert_equal(await land.sand_decode(material), new Uint8Array([1, 2, 3]));
            $mol_assert_equal((await land.sand_ordered({ head: $giper_baza_link.hole, peer: $giper_baza_link.hole })).length, 1);
            const tombstone = await land.post($giper_baza_link.hole, $giper_baza_link.hole, material.self(), null);
            $mol_assert_equal((await land.sand_encode(tombstone)).data().length, 1);
            $mol_assert_equal(await land.sand_decode(tombstone), null);
            $mol_assert_equal((await land.sand_ordered({ head: $giper_baza_link.hole, peer: $giper_baza_link.hole })).length, 1);
        },
        'Land fork & merge': $mol_wire_async(($) => {
            const home = $.$giper_baza_glob.home().land();
            const left = home.fork();
            home.Data($giper_baza_list).items_vary(['foo', 'xxx']);
            $mol_assert_equal(home.Data($giper_baza_list).items_vary(), ['foo', 'xxx']);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), ['foo', 'xxx']);
            left.faces.sync(home.faces);
            left.Data($giper_baza_list).items_vary(['foo', 'yyy']);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), ['foo', 'yyy']);
            const right = home.fork();
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary(['foo', 'zzz']);
            $mol_assert_equal(right.Data($giper_baza_list).items_vary(), ['foo', 'zzz']);
            const both = home.fork();
            $mol_assert_equal(both.Data($giper_baza_list).items_vary(), ['foo', 'xxx']);
            both.Tine().items_vary([right.link()]);
            $mol_assert_equal(both.Data($giper_baza_list).items_vary(), ['foo', 'zzz']);
            both.Tine().items_vary([left.link()]);
            $mol_assert_equal(both.Data($giper_baza_list).items_vary(), ['foo', 'yyy']);
            both.Tine().items_vary([right.link(), left.link()]);
            $mol_assert_equal(both.Data($giper_baza_list).items_vary(), ['foo', 'yyy']);
            both.Tine().items_vary([left.link(), right.link()]);
            $mol_assert_equal(both.Data($giper_baza_list).items_vary(), ['foo', 'zzz']);
        }),
        'Inner Links are relative to forked Land': $mol_wire_async(($) => {
            const Alice = $.$giper_baza_glob.home().land();
            const Bella = Alice.fork();
            const alice_val = Alice.Pawn($giper_baza_atom_text).Head(new $giper_baza_link('qwertyui'));
            const bella_val = Bella.Pawn($giper_baza_atom_text).Head(new $giper_baza_link('qwertyui'));
            alice_val.val('Alice');
            bella_val.val('Bella');
            const alice_link = Alice.Pawn($giper_baza_atom_link).Head(new $giper_baza_link('asdfghjk'));
            const bella_link = Bella.Pawn($giper_baza_atom_link).Head(new $giper_baza_link('asdfghjk'));
            alice_link.val(alice_val.link());
            $mol_assert_equal(alice_link.val(), alice_val.link());
            $mol_assert_unique(alice_link.val(), bella_link.val());
            $mol_assert_equal(bella_link.val(), bella_val.link());
        }),
        async 'Land Area inherits rights'($) {
            const area = await $mol_wire_async(() => {
                const base = $.$giper_baza_glob.land_grab([[null, $giper_baza_rank_post('just')]]);
                base.units_saving();
                return base.area_make();
            })();
            $mol_assert_equal(area.pass_rank(area.auth().pass()), $giper_baza_rank_rule);
            $mol_assert_equal(area.lord_rank($giper_baza_link.hole), $giper_baza_rank_post('just'));
        },
        // async 'Merge text changes'() {
        // 	const base = new $giper_baza_land( 1n, 1 )
        // 	base.chief.as( $hyoo_crowd_text ).str( 'Hello World and fun!' )
        // 	const left = base.fork( await $hyoo_crowd_peer.generate() )
        // 	const right = base.fork( await $hyoo_crowd_peer.generate() )
        // 	right.clock_data.tick( right.peer().id )
        // 	left.chief.as( $hyoo_crowd_text ).str( 'Hello Alice and fun!' )
        // 	right.chief.as( $hyoo_crowd_text ).str( 'Bye World and fun!' )
        // 	const left_delta = left.delta()
        // 	const right_delta = right.delta()
        // 	left.apply( right_delta )
        // 	right.apply( left_delta )
        // 	$mol_assert_equal(
        // 		left.chief.as( $hyoo_crowd_text ).str(),
        // 		right.chief.as( $hyoo_crowd_text ).str(),
        // 		'Bye Alice and fun!',
        // 	)
        // },
        // async 'Write into token'() {
        // 	const store = new $giper_baza_land( 1n, 1 )
        // 	store.chief.as( $hyoo_crowd_text ).str( 'foobar' )
        // 	store.chief.as( $hyoo_crowd_text ).write( 'xyz', 3 )
        // 	$mol_assert_equal( store.chief.as( $hyoo_crowd_list ).list(), [ 'fooxyzbar' ] )
        // },
        // async 'Write into token with split'() {
        // 	const store = new $giper_baza_land( 1n, 1 )
        // 	store.chief.as( $hyoo_crowd_text ).str( 'foobar' )
        // 	store.chief.as( $hyoo_crowd_text ).write( 'XYZ', 2, 4 )
        // 	$mol_assert_equal( store.chief.as( $hyoo_crowd_list ).list(), [ 'fo', 'XYZar' ] )
        // },
        // async 'Write over few tokens'() {
        // 	const store = new $giper_baza_land( 1n, 1 )
        // 	store.chief.as( $hyoo_crowd_text ).str( 'xxx foo bar yyy' )
        // 	store.chief.as( $hyoo_crowd_text ).write( 'X Y Z', 6, 9 )
        // 	$mol_assert_equal( store.chief.as( $hyoo_crowd_list ).list(), [ 'xxx', ' fo', 'X', ' Y', ' Zar', ' yyy' ] )
        // },
        // async 'Write whole token'() {
        // 	const store = new $giper_baza_land( 1n, 1 )
        // 	store.chief.as( $hyoo_crowd_text ).str( 'xxxFoo yyy' )
        // 	store.chief.as( $hyoo_crowd_text ).write( 'bar', 3, 7 )
        // 	$mol_assert_equal( store.chief.as( $hyoo_crowd_list ).list(), [ 'xxxbaryyy' ] )
        // },
        // async 'Write whole text'() {
        // 	const store = new $giper_baza_land( 1n, 1 )
        // 	store.chief.as( $hyoo_crowd_text ).str( 'foo bar' )
        // 	store.chief.as( $hyoo_crowd_text ).write( 'xxx', 0, 7 )
        // 	$mol_assert_equal( store.chief.as( $hyoo_crowd_list ).list(), [ 'xxx' ] )
        // },
        // async 'Write at the end'() {
        // 	const store = new $giper_baza_land( 1n, 1 )
        // 	store.chief.as( $hyoo_crowd_text ).str( 'foo' )
        // 	store.chief.as( $hyoo_crowd_text ).write( 'bar' )
        // 	$mol_assert_equal( store.chief.as( $hyoo_crowd_list ).list(), [ 'foobar' ] )
        // },
        // async 'Write between tokens'() {
        // 	const store = new $giper_baza_land( 1n, 1 )
        // 	store.chief.as( $hyoo_crowd_text ).str( 'foo bar' )
        // 	store.chief.as( $hyoo_crowd_text ).write( 'xxx', 4 )
        // 	$mol_assert_equal( store.chief.as( $hyoo_crowd_list ).list(), [ 'foo', ' xxxbar' ] )
        // },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'gift unit type'() {
            const gift = $giper_baza_unit_gift.make();
            gift.rank($giper_baza_rank_rule);
            $mol_assert_equal(gift.kind(), 'gift');
            $mol_assert_equal(gift.rank(), $giper_baza_rank_rule);
        },
        'data unit type'() {
            const unit = $giper_baza_unit_sand.make(2);
            unit.ball(new Uint8Array([0xFF, 0xFF]));
            $mol_assert_equal(unit.kind(), 'sand');
            $mol_assert_equal(unit.size(), 2);
            $mol_assert_equal(unit.ball(), new Uint8Array([0xFF, 0xFF]));
        },
        'big data unit type'() {
            const unit = $giper_baza_unit_sand.make(1000);
            unit.ball(new Uint8Array(1000));
            $mol_assert_equal(unit.kind(), 'sand');
            $mol_assert_equal(unit.size(), 1000);
            $mol_assert_equal(unit.ball(), new Uint8Array(1000));
        },
        'gift unit fields'() {
            const unit = $giper_baza_unit_gift.make();
            $mol_assert_equal(unit.time(), 0);
            $mol_assert_equal(unit.mate(), $giper_baza_link.hole);
            unit.time_tick(0xd1d2d3d4d5d6);
            unit.mate(new $giper_baza_link('ÆPv6æfj3_9vX08ÆLx'));
            $mol_assert_equal(unit.time_tick(), 0xd1d2d3d4d5d6);
            $mol_assert_equal(unit.mate(), new $giper_baza_link('ÆPv6æfj3_9vX08ÆLx'));
        },
        'data unit fields'() {
            const unit = $giper_baza_unit_sand.make(0);
            $mol_assert_equal(unit.time(), 0);
            $mol_assert_equal(unit.head(), $giper_baza_link.hole);
            $mol_assert_equal(unit.self(), $giper_baza_link.hole);
            $mol_assert_equal(unit.lead(), $giper_baza_link.hole);
            unit.time_tick(0xd1d2d3d4d5d6);
            unit.head(new $giper_baza_link('ÆPv6æfj3'));
            unit.self(new $giper_baza_link('Pv6æfj39'));
            unit.lead(new $giper_baza_link('v6æfj39v'));
            $mol_assert_equal(unit.time_tick(), 0xd1d2d3d4d5d6);
            $mol_assert_equal(unit.head(), new $giper_baza_link('ÆPv6æfj3'));
            $mol_assert_equal(unit.self(), new $giper_baza_link('Pv6æfj39'));
            $mol_assert_equal(unit.lead(), new $giper_baza_link('v6æfj39v'));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        async 'put, get, drop, count records and clear store'() {
            const db = await $$.$mol_db('$mol_db_test', mig => mig.store_make('letters'));
            const trans = db.change('letters');
            try {
                const { letters } = trans.stores;
                $mol_assert_like(await letters.get(1), undefined);
                $mol_assert_like(await letters.get(2), undefined);
                $mol_assert_like(await letters.count(), 0);
                await letters.put('a');
                await letters.put('b', 1);
                await letters.put('c', 2);
                $mol_assert_like(await letters.get(1), 'b');
                $mol_assert_like(await letters.get(2), 'c');
                $mol_assert_like(await letters.count(), 2);
                await letters.drop(1);
                $mol_assert_like(await letters.get(1), undefined);
                $mol_assert_like(await letters.count(), 1);
                await letters.clear();
                $mol_assert_like(await letters.count(), 0);
            }
            finally {
                trans.abort();
                db.kill();
            }
        },
        async 'select by query'() {
            const db = await $$.$mol_db('$mol_db_test', mig => mig.store_make('letters'));
            const trans = db.change('letters');
            try {
                const { letters } = trans.stores;
                await letters.put('a');
                await letters.put('b');
                await letters.put('c');
                await letters.put('d');
                $mol_assert_like(await letters.select(), ['a', 'b', 'c', 'd']);
                $mol_assert_like(await letters.select(null, 2), ['a', 'b']);
                $mol_assert_like(await letters.select($mol_dom_context.IDBKeyRange.bound(2, 3)), ['b', 'c']);
            }
            finally {
                trans.abort();
                db.kill();
            }
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        async 'take and drop db'() {
            const db = await $$.$mol_db('$mol_db_test');
            await db.kill();
        },
        async 'make and drop store in separate migrations'() {
            try {
                const db1 = await $$.$mol_db('$mol_db_test', mig => mig.store_make('temp'));
                db1.destructor();
                $mol_assert_like(db1.stores, ['temp']);
                $mol_assert_like(db1.version, 2);
                const db2 = await $$.$mol_db('$mol_db_test', mig => mig.store_make('temp'), mig => mig.store_drop('temp'));
                db2.destructor();
                $mol_assert_like(db2.stores, []);
                $mol_assert_like(db2.version, 3);
            }
            finally {
                const db0 = await $$.$mol_db('$mol_db_test');
                await db0.kill();
            }
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        async 'unique index'() {
            const db = await $$.$mol_db('$mol_db_test', mig => mig.store_make('users'), mig => mig.stores.users.index_make('names', ['name'], true));
            const trans = db.change('users');
            try {
                const { users } = trans.stores;
                await users.put({ name: 'Jin' }, 'jin');
                await users.put({ name: 'John' }, 'john');
                await users.put({ name: 'Bin' }, 'bin');
                const { names } = users.indexes;
                $mol_assert_like(await names.get(['Jin']), { name: 'Jin' });
                $mol_assert_like(await names.get(['John']), { name: 'John' });
                $mol_assert_like(await names.count(), 3);
                $mol_assert_like(await names.select($mol_dom_context.IDBKeyRange.bound(['J'], ['J\uFFFF'])), [{ name: 'Jin' }, { name: 'John' }]);
                try {
                    await users.put({ name: 'Jin' }, 'jin2');
                    $mol_fail(new Error('Exception expected'));
                }
                catch (error) {
                    $mol_assert_unique(error.message, 'Exception expected');
                }
            }
            finally {
                trans.abort();
                await db.kill();
            }
        },
        async 'multi path index'() {
            const db = await $$.$mol_db('$mol_db_test', mig => mig.store_make('users'), mig => mig.stores.users.index_make('names', ['first', 'last']));
            const trans = db.change('users');
            try {
                const { users } = trans.stores;
                await users.put({ first: 'Jin', last: 'Johnson' }, 'jin');
                await users.put({ first: 'John', last: 'Jinson' }, 'john');
                await users.put({ first: 'Bond', last: 'James' }, '007');
                const { names } = users.indexes;
                $mol_assert_like(await names.get(['Jin', 'Johnson']), { first: 'Jin', last: 'Johnson' });
                $mol_assert_like(await names.get(['John', 'Jinson']), { first: 'John', last: 'Jinson' });
                $mol_assert_like(await names.count(), 3);
                $mol_assert_like(await names.select($mol_dom_context.IDBKeyRange.bound(['Jin', 'Johnson'], ['John', 'Jinson'])), [{ first: 'Jin', last: 'Johnson' }, { first: 'John', last: 'Jinson' }]);
            }
            finally {
                trans.abort();
                await db.kill();
            }
        },
        async 'multiple indexes'() {
            const db = await $$.$mol_db('$mol_db_test', mig => mig.store_make('users'), mig => mig.stores.users.index_make('names', ['name'], true), mig => mig.stores.users.index_make('ages', ['age']));
            const trans = db.change('users');
            try {
                const { users } = trans.stores;
                await users.put({ name: 'Jin', age: 18 }, 'jin');
                await users.put({ name: 'John', age: 18 }, 'john');
                const { names, ages } = users.indexes;
                $mol_assert_like(await names.select(['Jin']), [{ name: 'Jin', age: 18 }]);
                $mol_assert_like(await names.select(['John']), [{ name: 'John', age: 18 }]);
                $mol_assert_like(await names.count(), 2);
                $mol_assert_like(await ages.select([18]), [{ name: 'Jin', age: 18 }, { name: 'John', age: 18 }]);
                $mol_assert_like(await ages.count(), 2);
            }
            finally {
                trans.abort();
                await db.kill();
            }
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        class $giper_baza_mine_mock extends $.$giper_baza_mine_temp {
        }
        $.$giper_baza_mine = $giper_baza_mine_mock;
    });
})($ || ($ = {}));

;
"use strict";
/** @jsx $mol_jsx */
/** @jsxFrag $mol_jsx_frag */
var $;
(function ($) {
    $mol_test({
        'same list'() {
            const list = $mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "old" }, "b"),
                $mol_jsx("p", { "data-rev": "old" }, "c"));
            $mol_reconcile({
                prev: [...list.children],
                from: 0,
                to: 3,
                next: 'abc',
                equal: (next, prev) => prev.textContent === next,
                drop: (prev, lead) => list.removeChild(prev),
                insert: (next, lead) => list.insertBefore($mol_jsx("p", { "data-rev": "new" }, next), lead ? lead.nextSibling : list.firstChild),
                replace: (next, prev, lead) => {
                    prev.textContent = next;
                    prev.setAttribute('data-rev', 'up');
                    return prev;
                },
            });
            $mol_assert_equal(list.outerHTML, ($mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "old" }, "b"),
                $mol_jsx("p", { "data-rev": "old" }, "c"))).outerHTML);
        },
        'insert items'() {
            const list = $mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "old" }, "b"),
                $mol_jsx("p", { "data-rev": "old" }, "c"),
                $mol_jsx("p", { "data-rev": "old" }, "d"));
            $mol_reconcile({
                prev: [...list.children],
                from: 1,
                to: 3,
                next: 'bXYc',
                equal: (next, prev) => prev.textContent === next,
                drop: (prev, lead) => list.removeChild(prev),
                insert: (next, lead) => list.insertBefore($mol_jsx("p", { "data-rev": "new" }, next), lead ? lead.nextSibling : list.firstChild),
                replace: (next, prev, lead) => {
                    prev.textContent = next;
                    prev.setAttribute('data-rev', 'up');
                    return prev;
                },
            });
            $mol_assert_equal(list.outerHTML, ($mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "old" }, "b"),
                $mol_jsx("p", { "data-rev": "new" }, "X"),
                $mol_jsx("p", { "data-rev": "new" }, "Y"),
                $mol_jsx("p", { "data-rev": "old" }, "c"),
                $mol_jsx("p", { "data-rev": "old" }, "d"))).outerHTML);
        },
        'append items'() {
            const list = $mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"));
            $mol_reconcile({
                prev: [...list.children],
                from: 2,
                to: 3,
                next: 'bc',
                equal: (next, prev) => prev.textContent === next,
                drop: (prev, lead) => list.removeChild(prev),
                insert: (next, lead) => list.insertBefore($mol_jsx("p", { "data-rev": "new" }, next), lead ? lead.nextSibling : list.firstChild),
                replace: (next, prev, lead) => {
                    prev.textContent = next;
                    prev.setAttribute('data-rev', 'up');
                    return prev;
                },
            });
            $mol_assert_equal(list.outerHTML, ($mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "new" }, "b"),
                $mol_jsx("p", { "data-rev": "new" }, "c"))).outerHTML);
        },
        'split item'() {
            const list = $mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "old" }, "bc"),
                $mol_jsx("p", { "data-rev": "old" }, "d"));
            $mol_reconcile({
                prev: [...list.children],
                from: 0,
                to: 3,
                next: 'abcd',
                equal: (next, prev) => prev.textContent === next,
                drop: (prev, lead) => list.removeChild(prev),
                insert: (next, lead) => list.insertBefore($mol_jsx("p", { "data-rev": "new" }, next), lead ? lead.nextSibling : list.firstChild),
                replace: (next, prev, lead) => {
                    prev.textContent = next;
                    prev.setAttribute('data-rev', 'up');
                    return prev;
                },
            });
            $mol_assert_equal(list.outerHTML, ($mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "new" }, "b"),
                $mol_jsx("p", { "data-rev": "up" }, "c"),
                $mol_jsx("p", { "data-rev": "old" }, "d"))).outerHTML);
        },
        'drop items'() {
            const list = $mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "A"),
                $mol_jsx("p", { "data-rev": "old" }, "B"),
                $mol_jsx("p", { "data-rev": "old" }, "x"),
                $mol_jsx("p", { "data-rev": "old" }, "y"),
                $mol_jsx("p", { "data-rev": "old" }, "C"),
                $mol_jsx("p", { "data-rev": "old" }, "D"));
            $mol_reconcile({
                prev: [...list.children],
                from: 1,
                to: 5,
                next: 'BC',
                equal: (next, prev) => prev.textContent === next,
                drop: (prev, lead) => list.removeChild(prev),
                insert: (next, lead) => list.insertBefore($mol_jsx("p", { "data-rev": "new" }, next), lead ? lead.nextSibling : list.firstChild),
                replace: (next, prev, lead) => {
                    prev.textContent = next;
                    prev.setAttribute('data-rev', 'up');
                    return prev;
                },
            });
            $mol_assert_equal(list.outerHTML, ($mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "A"),
                $mol_jsx("p", { "data-rev": "old" }, "B"),
                $mol_jsx("p", { "data-rev": "old" }, "C"),
                $mol_jsx("p", { "data-rev": "old" }, "D"))).outerHTML);
        },
        'update items'() {
            const list = $mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "old" }, "B"),
                $mol_jsx("p", { "data-rev": "old" }, "C"),
                $mol_jsx("p", { "data-rev": "old" }, "d"));
            $mol_reconcile({
                prev: [...list.children],
                from: 1,
                to: 3,
                next: 'XY',
                equal: (next, prev) => prev.textContent === next,
                drop: (prev, lead) => list.removeChild(prev),
                insert: (next, lead) => list.insertBefore($mol_jsx("p", { "data-rev": "new" }, next), lead ? lead.nextSibling : list.firstChild),
                replace: (next, prev, lead) => {
                    prev.textContent = next;
                    prev.setAttribute('data-rev', 'up');
                    return prev;
                },
            });
            $mol_assert_equal(list.outerHTML, ($mol_jsx("body", null,
                $mol_jsx("p", { "data-rev": "old" }, "a"),
                $mol_jsx("p", { "data-rev": "up" }, "X"),
                $mol_jsx("p", { "data-rev": "up" }, "Y"),
                $mol_jsx("p", { "data-rev": "old" }, "d"))).outerHTML);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Boolean schema"($) {
                $mol_assert_equal('$mol_schema_boolean', $mol_schema_boolean + '', $mol_key($mol_schema_boolean));
                $mol_assert_equal(true, $mol_schema_boolean.check(false));
                $mol_assert_equal(true, $mol_schema_boolean.check(true));
                $mol_assert_equal(false, $mol_schema_boolean.check('true'));
                $mol_assert_equal(false, $mol_schema_boolean.check(0));
                $mol_assert_equal(false, $mol_schema_boolean.cast(false));
                $mol_assert_equal(false, $mol_schema_boolean.cast('true'));
                $mol_assert_equal(false, $mol_schema_boolean.guard(false));
                $mol_assert_fail(() => $mol_schema_boolean.guard(null), 'Wrong type');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Integer schema"($) {
                $mol_assert_equal('$mol_schema_integer', $mol_schema_integer + '', $mol_key($mol_schema_integer));
                $mol_assert_equal(true, $mol_schema_integer.check(Number.MAX_SAFE_INTEGER));
                $mol_assert_equal(true, $mol_schema_integer.check(Number.MIN_SAFE_INTEGER));
                $mol_assert_equal(true, $mol_schema_integer.check(0));
                $mol_assert_equal(false, $mol_schema_integer.check(Number.EPSILON));
                $mol_assert_equal(false, $mol_schema_integer.check(Number.POSITIVE_INFINITY));
                $mol_assert_equal(false, $mol_schema_integer.check(Number.NEGATIVE_INFINITY));
                $mol_assert_equal(Number.MAX_SAFE_INTEGER, $mol_schema_integer.cast(Number.MAX_SAFE_INTEGER));
                $mol_assert_equal(0, $mol_schema_integer.cast(Number.EPSILON));
                $mol_assert_equal(0, $mol_schema_integer.cast(1.5));
                $mol_assert_equal(0, $mol_schema_integer.guard(0));
                $mol_assert_fail(() => $mol_schema_integer.guard(''), 'Wrong type');
                $mol_assert_fail(() => $mol_schema_integer.guard(Number.NaN), 'Non finite');
                $mol_assert_fail(() => $mol_schema_integer.guard(1.5), 'Non integer');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "BigInt schema"($) {
                $mol_assert_equal('$mol_schema_bigint', $mol_schema_bigint + '', $mol_key($mol_schema_bigint));
                $mol_assert_equal(true, $mol_schema_bigint.check(0n));
                $mol_assert_equal(false, $mol_schema_bigint.check(0));
                $mol_assert_equal(1n, $mol_schema_bigint.cast(1n));
                $mol_assert_equal(1n, $mol_schema_bigint.cast(1));
                $mol_assert_equal(0n, $mol_schema_bigint.guard(0n));
                $mol_assert_fail(() => $mol_schema_bigint.guard(1), 'Wrong type');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $.$mol_schema_pattern = $mol_memo_key.func(function $mol_schema_pattern(Pattern) {
        return class $mol_schema_pattern_ extends $mol_schema_string {
            static Pattern = Pattern;
            static toString() {
                if (this !== $mol_schema_pattern_)
                    return super.toString();
                return '$mol_schema_pattern<' + $mol_key(Pattern) + '>';
            }
            static guard(value) {
                if (Pattern.test(super.guard(value)))
                    return value;
                return $mol_fail(new TypeError('Wrong string', { cause: { value, schema: this } }));
            }
            static cast(value) {
                return super.cast(value);
            }
            static default = '';
        };
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Cache of pattern schema"($) {
                $mol_assert_equal($mol_schema_pattern(/foo/), $mol_schema_pattern(/foo/));
                $mol_assert_unique($mol_schema_pattern(/foo/), $mol_schema_pattern(/bar/));
            },
            "String pattern schema"($) {
                const Email = $mol_schema_pattern(/^.*@.*$/);
                $mol_assert_equal('$mol_schema_pattern</^.*@.*$/>', Email + '', $mol_key(Email));
                $mol_assert_equal(true, Email.check('foo@bar'));
                $mol_assert_equal(false, Email.check('foo'));
                $mol_assert_equal(false, Email.check(123));
                $mol_assert_equal('foo@bar', Email.cast('foo@bar'));
                $mol_assert_equal('', Email.cast('foo'));
                $mol_assert_equal('', Email.cast(123));
                $mol_assert_equal('foo@bar', Email.guard('foo@bar'));
                $mol_assert_fail(() => Email.guard('foo'), 'Wrong string');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        "Cache of dict schema"($) {
            $mol_assert_equal($mol_schema_dict([$mol_schema_string, $mol_schema_float]), $mol_schema_dict([$mol_schema_string, $mol_schema_float]));
            $mol_assert_unique($mol_schema_dict([$mol_schema_string, $mol_schema_float]), $mol_schema_dict([$mol_schema_string, $mol_schema_string]));
        },
        "Dictionary schema"($) {
            const Flags = $mol_schema_dict([$mol_schema_pattern(/^[a-z]+$/), $mol_schema_boolean]);
            $mol_assert_equal(true, Flags.check({}));
            $mol_assert_equal(true, Flags.check({ foo: false }));
            $mol_assert_equal(false, Flags.check({ f00: false }));
            $mol_assert_equal(false, Flags.check([]));
            $mol_assert_equal(false, Flags.check({ foo: 0 }));
            $mol_assert_equal({ foo: false }, Flags.cast({ foo: false, f00: true }));
            $mol_assert_equal({ foo: false }, Flags.cast({ foo: 123 }));
            $mol_assert_equal({}, Flags.guard({}));
            $mol_assert_equal({ foo: false }, Flags.guard({ foo: false }));
            $mol_assert_fail(() => Flags.guard({ foo: 123 }), 'Wrong val');
            $mol_assert_fail(() => Flags.guard({ f00: 123 }), 'Wrong key');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Cache of list schema"($) {
                $mol_assert_equal($mol_schema_list($mol_schema_float), $mol_schema_list($mol_schema_float));
                $mol_assert_unique($mol_schema_list($mol_schema_float), $mol_schema_list($mol_schema_string));
            },
            "Array schema"($) {
                const Vector = $mol_schema_list($mol_schema_float);
                $mol_assert_equal('$mol_schema_list<$mol_schema_float>', Vector + '');
                $mol_assert_equal(true, Vector.check([]));
                $mol_assert_equal(true, Vector.check([123]));
                $mol_assert_equal(false, Vector.check(['foo']));
                $mol_assert_equal([123], Vector.cast([123]));
                $mol_assert_equal([123, Number.NaN], Vector.cast([123, 'foo']));
                $mol_assert_equal([], Vector.guard([]));
                $mol_assert_equal([123], Vector.guard([123]));
                $mol_assert_fail(() => Vector.guard(0), 'Non array');
                $mol_assert_fail(() => Vector.guard([false]), 'Wrong item');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $.$mol_schema_enum = $mol_memo_key.func(function $mol_schema_enum(Options) {
        return class $mol_schema_enum_ extends $mol_schema_any {
            static Options = Options;
            static toString() {
                if (this !== $mol_schema_enum_)
                    return super.toString();
                return '$mol_schema_enum<' + $mol_key(Options) + '>';
            }
            static guard(value) {
                if (Options.some(Option => Object.is(Option, value)))
                    return value;
                return $mol_fail(new TypeError('Wrong option', { cause: { value, schema: this } }));
            }
            static cast(value) {
                if (this.check(value))
                    return value;
                return Options[0];
            }
            static default = Options[0];
        };
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Cache of enum schema"($) {
                $mol_assert_equal($mol_schema_enum(['foo']), $mol_schema_enum(['foo']));
                $mol_assert_unique($mol_schema_enum(['foo']), $mol_schema_enum(['bar']));
            },
            "Enum options"($) {
                const Config = $mol_schema_enum([123, 'foo']);
                $mol_assert_equal('$mol_schema_enum<[123,"foo"]>', Config + '', $mol_key(Config));
                $mol_assert_equal(true, Config.check(123));
                $mol_assert_equal(true, Config.check('foo'));
                $mol_assert_equal(false, Config.check(true));
                $mol_assert_equal(false, Config.check(321));
                $mol_assert_equal(false, Config.check('bar'));
                $mol_assert_equal(Config.cast(123), 123);
                $mol_assert_equal(Config.cast('foo'), 'foo');
                $mol_assert_equal(Config.cast('bar'), 123);
                $mol_assert_equal(123, Config.guard(123));
                $mol_assert_fail(() => Config.guard(321), 'Wrong option');
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            "Empty representation"($) {
                const land = $giper_baza_land.make({ $ });
                const reg = land.Pawn($giper_baza_atom_time).Data();
                $mol_assert_equal(reg.val(), null);
                reg.vary(null);
                $mol_assert_equal(reg.val(), null);
            },
            "Validation on set, cast on get"($) {
                const land = $.$giper_baza_glob.home().land();
                const head = new $giper_baza_link('22222222');
                const str = land.Pawn($giper_baza_atom.of($mol_schema_maybe($mol_schema_string))).Head(head);
                const mail = land.Pawn($giper_baza_atom.of($mol_schema_pattern(/.+@.+/))).Head(head);
                $mol_assert_equal(str.val(), null);
                $mol_assert_equal(mail.val(), null);
                $mol_assert_fail(() => str.val(123), 'Wrong type');
                $mol_assert_fail(() => mail.val('foo'), 'Wrong string');
                $mol_assert_equal(str.val(), null);
                $mol_assert_equal(mail.val(), null);
                str.val('foo');
                $mol_assert_equal(str.val(), 'foo');
                $mol_assert_equal(mail.val(), null);
                mail.val('foo@bar');
                $mol_assert_equal(str.val(), 'foo@bar');
                $mol_assert_equal(mail.val(), 'foo@bar');
            },
            "Hyper link to another land"($) {
                const land = $.$giper_baza_glob.home().land();
                const reg = land.Pawn($giper_baza_atom_link.to(() => $giper_baza_atom)).Head(new $giper_baza_link('11111111'));
                const remote = reg.ensure(land);
                $mol_assert_unique(reg.land(), remote.land());
                $mol_assert_equal(reg.vary(), remote.link());
                $mol_assert_equal(reg.remote(), remote);
            },
            "Register with linked Pawns"($) {
                const land = $.$giper_baza_glob.home().land();
                const str = land.Pawn($giper_baza_atom_text).Head(new $giper_baza_link('11111111'));
                const link = land.Pawn($giper_baza_atom_link.to(() => $giper_baza_atom_text)).Head(new $giper_baza_link('11111111'));
                $mol_assert_equal(link.remote(), null);
                link.remote(str);
                $mol_assert_equal(link.vary(), link.remote().link(), str.link());
            },
            "Enumerated reg type"($) {
                class FileType extends $giper_baza_atom.of($mol_schema_maybe($mol_schema_enum(['file', 'dir', 'link']))) {
                }
                const land = $.$giper_baza_glob.home().land();
                const type = land.Data(FileType);
                $mol_assert_equal(type.val(), null);
                type.val('file');
                $mol_assert_equal(type.val(), 'file');
                $mol_assert_fail(() => type.val('drive'), 'Wrong option');
                $mol_assert_equal(type.val(), 'file');
                type.vary('drive');
                $mol_assert_equal(type.val(), null);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    function clone(base) {
        const land = $mol_wire_sync(base.$.$giper_baza_land).make({ $: base.$ });
        land.units_steal(base);
        return land;
    }
    function sync(left, right) {
        left.units_steal(right);
        right.units_steal(left);
    }
    $mol_test({
        'Basic list ops'($) {
            const land = $.$giper_baza_land.make({ $ });
            const list = land.Pawn($giper_baza_list).Data();
            $mol_assert_equal(list.items_vary(), []);
            list.items_vary([2, 3]);
            $mol_assert_equal(list.items_vary(), [2, 3]);
            $mol_assert_equal(list.has(1), false);
            list.add(1);
            $mol_assert_equal(list.items_vary(), [1, 2, 3]);
            $mol_assert_equal(list.has(1), true);
            list.add(3);
            $mol_assert_equal(list.items_vary(), [1, 2, 3]);
            list.splice([2]);
            $mol_assert_equal(list.items_vary(), [1, 2, 3, 2]);
            list.splice([2], 0);
            $mol_assert_equal(list.items_vary(), [2, 1, 2, 3, 2]);
            list.wipe(2);
            $mol_assert_equal(list.items_vary(), [2, 1, 3, 2]);
            list.move(2, 1);
            $mol_assert_equal(list.items_vary(), [2, 3, 1, 2]);
            list.move(1, 3);
            $mol_assert_equal(list.items_vary(), [2, 1, 3, 2]);
            list.cut(2);
            $mol_assert_equal(list.items_vary(), [1, 3]);
            $mol_assert_equal(list.has(2), false);
            list.cut(2);
            $mol_assert_equal(list.items_vary(), [1, 3]);
        },
        'Different types'($) {
            const land = $.$giper_baza_land.make({ $ });
            const list = land.Pawn($.$giper_baza_list).Data();
            list.items_vary([
                null,
                false,
                true,
                0n,
                4611686018427387904n,
                0,
                Math.PI,
                Number.NaN,
                Number.NEGATIVE_INFINITY,
                '',
                '1234567890123456789012345678901234567890',
                new Uint8Array([]),
                new Uint8Array([1, 2, 3]),
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]),
                list.link(),
            ]);
            $mol_assert_equal(list.items_vary(), [
                false,
                true,
                0,
                4611686018427387904n,
                0,
                Math.PI,
                Number.NaN,
                Number.NEGATIVE_INFINITY,
                '',
                '1234567890123456789012345678901234567890',
                new Uint8Array([]),
                new Uint8Array([1, 2, 3]),
                new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]),
                list.link(),
            ]);
        },
        async 'List merge'($) {
            const land1 = $.$giper_baza_land.make({ $ });
            const land2 = $.$giper_baza_land.make({ $ });
            const list1 = land1.Pawn($giper_baza_list).Data();
            const list2 = land2.Pawn($giper_baza_list).Data();
            list1.items_vary(['foo', 'xxx']);
            land2.faces.tick();
            list2.items_vary(['foo', 'yyy']);
            await $mol_wire_async(land1).units_steal(land2);
            $mol_assert_equal(list1.items_vary(), ['foo', 'yyy', 'foo', 'xxx']);
        },
        'Insert before removed before changed'($) {
            const land = $.$giper_baza_land.make({ $ });
            const list = land.Pawn($giper_baza_list).Data();
            list.items_vary(['foo', 'bar']);
            list.items_vary(['xxx', 'foo', 'bar']);
            list.items_vary(['xxx', 'bars']);
            $mol_assert_equal(list.items_vary(), ['xxx', 'bars']);
        },
        'Many moves'($) {
            const land = $.$giper_baza_land.make({ $ });
            const list = land.Pawn($giper_baza_list).Data();
            list.items_vary(['foo', 'bar', 'lol']);
            list.move(2, 1);
            list.move(2, 1);
            list.move(0, 3);
            list.move(2, 1);
            $mol_assert_equal(list.items_vary(), ['bar', 'foo', 'lol']);
        },
        'Reorder separated sublists'($) {
            const land = $.$giper_baza_land.make({ $ });
            const list = land.Pawn($giper_baza_list).Data();
            list.items_vary([1, 2, 3, 4, 5, 6]);
            list.move(3, 5);
            list.move(3, 5);
            list.move(5, 4);
            list.move(0, 2);
            list.move(0, 2);
            list.move(2, 1);
            $mol_assert_equal(list.items_vary(), [1, 3, 2, 4, 6, 5]);
        },
        'Insert after moved right': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 7, 2, 3, 4]);
            const right = clone(base);
            right.Data($giper_baza_list).move(0, 2);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [2, 1, 7, 3, 4]);
        }),
        'Insert before moved left': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).move(1, 0);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 7, 2, 3, 4]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [2, 1, 7, 3, 4]);
        }),
        'Move left after inserted': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 7, 2, 3, 4]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).move(1, 0);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [2, 1, 3, 7, 4]);
        }),
        'Insert before moved right': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).move(1, 4);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 7, 2, 3, 4]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 7, 3, 4, 2]);
        }),
        'Move right after inserted': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 7, 2, 3, 4]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).move(1, 4);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 3, 7, 4, 2]);
        }),
        'Insert after wiped': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 3, 4]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 2, 7, 3, 4]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 7, 3, 4]);
        }),
        'Wiped before inserted': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 2, 7, 3, 4]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 3, 4]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 7, 3, 4]);
        }),
        'Insert before wiped': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).wipe(2);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 2, 7, 3, 4]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 2, 7, 4]);
        }),
        'Wiped after inserted': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 2, 7, 3, 4]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).wipe(2);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 2, 7, 4]);
        }),
        'Insert after moved out': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.sand_move(left.Data($giper_baza_list).units()[1], new $giper_baza_link('11111111'), 0);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 2, 7, 3, 4]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 7, 3, 4]);
            $mol_assert_equal(left.Pawn($giper_baza_list).Head(new $giper_baza_link('11111111')).items_vary(), right.Pawn($giper_baza_list).Head(new $giper_baza_link('11111111')).items_vary(), [2]);
        }),
        'Move out before inserted': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 2, 7, 3, 4]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.sand_move(right.Data($giper_baza_list).units()[1], new $giper_baza_link('11111111'), 0);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 7, 3, 4]);
            $mol_assert_equal(left.Pawn($giper_baza_list).Head(new $giper_baza_link('11111111')).items_vary(), right.Pawn($giper_baza_list).Head(new $giper_baza_link('11111111')).items_vary(), [2]);
        }),
        'Insert before changed': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 2, 7, 4]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 2, 13, 3, 4]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 2, 13, 7, 4]);
        }),
        'Change after inserted': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 2, 13, 3, 4]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 2, 7, 4]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 2, 7, 13, 4]);
        }),
        'Insert between moved': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4, 5, 6]);
            const left = clone(base);
            left.Data($giper_baza_list).move(1, 5);
            left.Data($giper_baza_list).move(1, 5);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).items_vary([1, 2, 7, 3, 4, 5, 6]);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 4, 5, 2, 7, 3, 6]);
        }),
        'Move near inserted': $mol_wire_async(($) => {
            const base = $mol_wire_sync($.$giper_baza_land).make({ $ });
            base.Data($giper_baza_list).items_vary([1, 2, 3, 4, 5, 6]);
            const left = clone(base);
            left.Data($giper_baza_list).items_vary([1, 2, 7, 3, 4, 5, 6]);
            const right = clone(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_list).move(1, 5);
            right.Data($giper_baza_list).move(1, 5);
            sync(left, right);
            $mol_assert_equal(left.Data($giper_baza_list).items_vary(), right.Data($giper_baza_list).items_vary(), [1, 4, 5, 2, 3, 7, 6]);
        }),
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $mol_test({
            async 'Dictionary invariants'($) {
                const land = $giper_baza_land.make({ $ });
                const dict = land.Pawn($giper_baza_dict).Data();
                $mol_assert_equal(dict.keys(), []);
                dict.dive(123, $giper_baza_atom, null);
                dict.dive('xxx', $giper_baza_atom, null);
                $mol_assert_equal(dict.keys(), ['xxx', 123]);
                $mol_assert_equal(dict.has(123), true);
                $mol_assert_equal(dict.has('xxx'), true);
                $mol_assert_equal(dict.has('yyy'), false);
                $mol_assert_equal(dict.dive(123, $giper_baza_atom).vary(), null);
                $mol_assert_equal(dict.dive('xxx', $giper_baza_atom).vary(), null);
                dict.dive(123, $giper_baza_atom).vary(777);
                $mol_assert_equal(dict.dive(123, $giper_baza_atom).vary(), 777);
                dict.dive('xxx', $giper_baza_list).items_vary(['foo', 'bar']);
                $mol_assert_equal(dict.dive('xxx', $giper_baza_list).items_vary(), ['foo', 'bar']);
                dict.has(123, false);
                $mol_assert_equal(dict.keys(), ['xxx']);
            },
            async 'Dictionary merge'($) {
                const land1 = $giper_baza_land.make({ $ });
                const land2 = $giper_baza_land.make({ $ });
                const dict1 = land1.Pawn($giper_baza_dict).Data();
                const dict2 = land2.Pawn($giper_baza_dict).Data();
                dict1.dive(123, $giper_baza_atom, null).vary(666);
                land2.faces.tick();
                dict2.dive(123, $giper_baza_atom, null).vary(777);
                await $mol_wire_async(land1).units_steal(land2);
                $mol_assert_equal(dict1.dive(123, $giper_baza_atom).vary(), 777);
                dict1.dive('xxx', $giper_baza_list, null).items_vary(['foo']);
                land2.faces.tick();
                dict2.dive('xxx', $giper_baza_list, null).items_vary(['bar']);
                await $mol_wire_async(land1).units_steal(land2);
                $mol_assert_equal(dict1.dive('xxx', $giper_baza_list).items_vary(), ['bar', 'foo']);
            },
            async "Narrowed Dictionary with linked Dictionaries and others"($) {
                class User extends $giper_baza_dict.with({
                    Title: $giper_baza_atom_text,
                    Account: $giper_baza_atom_link.to(() => Account),
                    Articles: $giper_baza_list_link.to(() => Article),
                }) {
                }
                class Account extends $giper_baza_dict.with({
                    Title: $giper_baza_atom_text,
                    User: $giper_baza_atom_link.to(() => User),
                }) {
                }
                class Article extends $giper_baza_dict.with({
                    Title: $giper_baza_dict_to($giper_baza_atom_text),
                    Author: $giper_baza_atom_link.to(() => User),
                }) {
                }
                const land = $.$giper_baza_glob.home().land();
                const user = land.Pawn(User).Head(new $giper_baza_link('11111111'));
                $mol_assert_equal(user.Title()?.val() ?? null, null);
                $mol_assert_equal(user.Account()?.remote() ?? null, null);
                $mol_assert_equal(user.Articles()?.remote_list() ?? [], []);
                user.Title(null).val('Jin');
                $mol_assert_equal(user.Title().val() ?? '', 'Jin');
                const account = (await $mol_wire_async(user.Account(null)).ensure([[null, $giper_baza_rank_read]]));
                $mol_assert_equal(user.Account()?.remote() ?? null, account);
                $mol_assert_equal(account.User()?.remote() ?? null, null);
                account.User(null).remote(user);
                $mol_assert_equal(account.User()?.remote(), user);
                const articles = [
                    await $mol_wire_async(user.Articles(null)).make([[null, $giper_baza_rank_read]]),
                    await $mol_wire_async(user.Articles(null)).make([[null, $giper_baza_rank_read]]),
                ];
                $mol_assert_equal(user.Articles()?.remote_list().map(n => n[Symbol.toStringTag]), articles.map(n => n[Symbol.toStringTag]));
                articles[0].Title(null).key('en', 'auto').val('Hello!');
                $mol_assert_equal(articles[0].Title()?.key('en').val(), 'Hello!');
                $mol_assert_equal(articles[1].Title()?.key('ru')?.val() ?? null, null);
                $mol_assert_equal(articles[1].Title()?.key('ru')?.val() ?? null, null);
                $mol_assert_unique(user.land(), account.land(), ...articles.map(article => article.land()));
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        class $giper_baza_glob_mock extends $.$giper_baza_glob {
            static $ = $;
            static lands_touched = new $mol_wire_set();
        }
        $.$giper_baza_glob = $giper_baza_glob_mock;
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        class $giper_baza_yard_mock extends $.$giper_baza_yard {
            master() {
                return null;
            }
        }
        $.$giper_baza_yard = $giper_baza_yard_mock;
    });
    $giper_baza_yard.masters = () => {
        $giper_baza_glob.Seed();
        return ['http://localhost:9090/'];
    };
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'empty string'() {
            $mol_assert_equal(''.match($giper_baza_text_tokens), null);
        },
        'new lines'() {
            $mol_assert_equal('\n\r\n'.match($giper_baza_text_tokens), ['\n', '\r\n']);
        },
        'numbers'() {
            $mol_assert_equal('123'.match($giper_baza_text_tokens), ['123']);
        },
        'emoji'() {
            $mol_assert_equal('😀😁'.match($giper_baza_text_tokens), ['😀', '😁']);
        },
        'emoji with modifier'() {
            $mol_assert_equal('👩🏿👩🏿'.match($giper_baza_text_tokens), ['👩🏿', '👩🏿']);
        },
        'combo emoji with modifier'() {
            $mol_assert_equal('👩🏿‍🤝‍🧑🏿👩🏿‍🤝‍🧑🏿'.match($giper_baza_text_tokens), ['👩🏿‍🤝‍🧑🏿', '👩🏿‍🤝‍🧑🏿']);
        },
        'word with spaces'() {
            $mol_assert_equal('foo1  bar2'.match($giper_baza_text_tokens), ['foo1', ' ', ' bar2']);
        },
        'word with diactric'() {
            $mol_assert_equal('Е́е́'.match($giper_baza_text_tokens), ['Е́е́']);
        },
        'word with punctuation'() {
            $mol_assert_equal('foo--bar'.match($giper_baza_text_tokens), ['foo', '--', 'bar']);
        },
        'CamelCase'() {
            $mol_assert_equal('Foo1BAR2'.match($giper_baza_text_tokens), ['Foo1', 'BAR2']);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'Change sequences'($) {
            const land = $giper_baza_land.make({ $ });
            const text = land.Data($giper_baza_text);
            const list = land.Data($giper_baza_list);
            $mol_assert_equal(text.str(), '');
            $mol_assert_equal(list.items_vary(), []);
            text.str('foo');
            $mol_assert_equal(text.str(), 'foo');
            $mol_assert_equal(list.items_vary(), ['foo']);
            text.str('foo bar');
            $mol_assert_equal(text.str(), 'foo bar');
            $mol_assert_equal(list.items_vary(), ['foo', ' bar']);
            text.str('foo lol bar');
            $mol_assert_equal(text.str(), 'foo lol bar');
            $mol_assert_equal(list.items_vary(), ['foo', ' lol', ' bar']);
            text.str('lol bar');
            $mol_assert_equal(text.str(), 'lol bar');
            $mol_assert_equal(list.items_vary(), ['lol', ' bar']);
            text.str('foo bar');
            $mol_assert_equal(text.str(), 'foo bar');
            $mol_assert_equal(list.items_vary(), ['foo', ' bar']);
            text.str('foo  bar');
            $mol_assert_equal(text.str(), 'foo  bar');
            $mol_assert_equal(list.items_vary(), ['foo', ' ', ' bar']);
            text.str('foo  BarBar');
            $mol_assert_equal(text.str(), 'foo  BarBar');
            $mol_assert_equal(list.items_vary(), ['foo', ' ', ' Bar', 'Bar']);
        },
        async 'str: Offset <=> Point'($) {
            const land = $giper_baza_land.make({ $ });
            const text = land.Data($giper_baza_text);
            text.str('fooBar');
            const [first, second] = text.units();
            $mol_assert_equal(text.point_by_offset(0), [first.self().str, 0, 0]);
            $mol_assert_equal(text.offset_by_point([first.self().str, 0, 0]), [first.self().str, 0]);
            $mol_assert_equal(text.point_by_offset(3), [first.self().str, 3, 0]);
            $mol_assert_equal(text.offset_by_point([first.self().str, 3, 0]), [first.self().str, 3]);
            $mol_assert_equal(text.offset_by_point([first.self().str, 5, 0]), [first.self().str, 5]);
            $mol_assert_equal(text.point_by_offset(5), [second.self().str, 2, 0]);
            $mol_assert_equal(text.offset_by_point([second.self().str, 2, 0]), [second.self().str, 5]);
            $mol_assert_equal(text.point_by_offset(6), [second.self().str, 3, 0]);
            $mol_assert_equal(text.offset_by_point([second.self().str, 3, 0]), [second.self().str, 6]);
            $mol_assert_equal(text.point_by_offset(7), ['', 1, 0]);
            $mol_assert_equal(text.offset_by_point(['', 1, 0]), ['', 7]);
        },
        async 'text: Offset <=> Point'($) {
            const land = $giper_baza_land.make({ $ });
            const text = land.Data($giper_baza_text);
            text.text('foo bar\n666 777');
            const [first, second] = text.pawns($giper_baza_text);
            $mol_assert_equal(text.point_by_offset(0), [first.units()[0].self().str, 0, 0]);
            $mol_assert_equal(text.offset_by_point([first.units()[0].self().str, 0, 0]), [first.units()[0].self().str, 0]);
            $mol_assert_equal(text.point_by_offset(8), [first.units()[2].self().str, 1, 0]);
            $mol_assert_equal(text.offset_by_point([first.units()[2].self().str, 1, 0]), [first.units()[2].self().str, 8]);
        },
        async 'Merge different sequences'($) {
            const land1 = $giper_baza_land.make({ $ });
            const land2 = $giper_baza_land.make({ $ });
            const text1 = land1.Pawn($giper_baza_text).Data();
            const text2 = land2.Pawn($giper_baza_text).Data();
            text1.str('foo bar.');
            land2.faces.stat.time = land1.faces.stat.time;
            text2.str('xxx yyy.');
            const delta1 = await $mol_wire_async(land1).diff_units();
            const delta2 = await $mol_wire_async(land2).diff_units();
            await $mol_wire_async(land1).diff_apply(delta2);
            await $mol_wire_async(land2).diff_apply(delta1);
            $mol_assert_equal(text1.str(), text2.str(), 'xxx yyy.foo bar.');
        },
        async 'Merge same insertions with different changes to same place'($) {
            const base = $giper_baza_land.make({ $ });
            base.Data($giper_baza_text).str('( )');
            const left = $giper_baza_land.make({ $ });
            await $mol_wire_async(left).units_steal(base);
            left.Data($giper_baza_text).str('( [ f ] )');
            left.Data($giper_baza_text).str('( [ foo ] )');
            const right = $giper_baza_land.make({ $ });
            await $mol_wire_async(right).units_steal(base);
            right.faces.sync(left.faces);
            right.Data($giper_baza_text).str('( [ f ] )');
            right.Data($giper_baza_text).str('( [ fu ] )');
            const left_delta = await $mol_wire_async(left).diff_units(base.faces);
            const right_delta = await $mol_wire_async(right).diff_units(base.faces);
            await $mol_wire_async(left).diff_apply(right_delta);
            await $mol_wire_async(right).diff_apply(left_delta);
            $mol_assert_equal(left.Data($giper_baza_text).str(), right.Data($giper_baza_text).str(), '( [ fu ] [ foo ] )');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    function check(str, query) {
        $mol_assert_like(str, $hyoo_harp_to_string(query));
        $mol_assert_like(query, $hyoo_harp_from_string(str));
    }
    $mol_test({
        'root'() {
            check('', {});
        },
        'only field'() {
            check('user%3D777', {
                'user=777': {},
            });
        },
        'primary key'() {
            check('user=jin%2C777!=', {
                user: {
                    '=': [['jin,777!']],
                },
            });
        },
        'single fetch'() {
            check('friend(age%24)', {
                friend: {
                    age$: {},
                },
            });
        },
        'fetch and primary key'() {
            check('user=jin()=(friend)', {
                'user': {
                    '=': [['jin()']],
                    friend: {},
                },
            });
        },
        'multiple fetch'() {
            check('age;friend', {
                age: {},
                friend: {},
            });
        },
        'common query string back compatible'() {
            $mol_assert_like($hyoo_harp_from_string('user=jin&age=100500'), {
                user: {
                    '=': [['jin']],
                },
                age: {
                    '=': [['100500']],
                },
            });
        },
        'common pathname back compatible'() {
            $mol_assert_like($hyoo_harp_from_string('users/jin/comments'), {
                users: {},
                jin: {},
                comments: {},
            });
        },
        'deep fetch'() {
            check('my(friend(age);name);stat', {
                my: {
                    friend: {
                        age: {},
                    },
                    name: {},
                },
                stat: {},
            });
        },
        'orders'() {
            check('+age;-name', {
                age: {
                    '+': true
                },
                name: {
                    '+': false
                },
            });
        },
        'filter types'() {
            check('sex=female=;status!=married=', {
                sex: {
                    '=': [['female']],
                },
                status: {
                    '!=': [['married']],
                },
            });
        },
        'filter ranges'() {
            check('sex=female=;age=18@25=;weight=@50=;height=150@=;hobby=paint=singing=', {
                sex: {
                    '=': [['female']],
                },
                age: {
                    '=': [['18', '25']],
                },
                weight: {
                    '=': [['', '50']],
                },
                height: {
                    '=': [['150', '']],
                },
                hobby: {
                    '=': [['paint'], ['singing']],
                },
            });
        },
        'unescaped values'() {
            $mol_assert_like($hyoo_harp_from_string('foo=jin=777=;bar=jin!=666='), {
                foo: {
                    '=': [['jin'], ['777']],
                },
                bar: {
                    '=': [['jin!'], ['666']],
                },
            });
        },
        'slicing'() {
            check('friend(_num=0@100=)', {
                friend: {
                    _num: { '=': [['0', '100']] },
                },
            });
        },
        'complex'() {
            check('pullRequest(state=closed=merged=;+repository(name;private);-updateTime;_num=0@100=)', {
                pullRequest: {
                    state: {
                        '=': [
                            ['closed'],
                            ['merged'],
                        ]
                    },
                    repository: {
                        '+': true,
                        name: {},
                        private: {},
                    },
                    updateTime: {
                        '+': false,
                    },
                    _num: {
                        '=': [['0', '100']],
                    },
                },
            });
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Is string'() {
            $mol_data_string('');
        },
        'Is not string'() {
            $mol_assert_fail(() => {
                $mol_data_string(0);
            }, '0 is not a string');
        },
        'Is object string'() {
            $mol_assert_fail(() => {
                $mol_data_string(new String('x'));
            }, 'x is not a string');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Is first'() {
            $mol_data_variant($mol_data_number, $mol_data_string)(0);
        },
        'Is second'() {
            $mol_data_variant($mol_data_number, $mol_data_string)('');
        },
        'Is false'() {
            $mol_assert_fail(() => {
                $mol_data_variant($mol_data_number, $mol_data_string)(false);
            }, 'false is not any of variants');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    const Age = $mol_data_optional($mol_data_number);
    const Age_or_zero = $mol_data_optional($mol_data_number, () => 0);
    $mol_test({
        'Is not present'() {
            $mol_assert_equal(Age(undefined), undefined);
        },
        'Is present'() {
            $mol_assert_equal(Age(0), 0);
        },
        'Fallbacked'() {
            $mol_assert_equal(Age_or_zero(undefined), 0);
        },
        'Is null'() {
            $mol_assert_fail(() => Age(null), 'null is not a number');
        },
    });
})($ || ($ = {}));

;
"use strict";

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Fit to record'() {
            const User = $mol_data_record({ age: $mol_data_number });
            User({ age: 0 });
        },
        'Extends record'() {
            const User = $mol_data_record({ age: $mol_data_number });
            User({ age: 0, name: 'Jin' });
        },
        // 'Recursive record' () {
        // 	const User = $mol_data_record({
        // 		name : $mol_data_string ,
        // 		get kids() { return $mol_data_array( User ) } ,
        // 	})
        // 	User({
        // 		name : 'Jin' ,
        // 		kids : [
        // 			{
        // 				name : 'John' ,
        // 				kids : [] ,
        // 			}
        // 		] ,
        // 	})
        // } ,
        'Shrinks record'() {
            $mol_assert_fail(() => {
                const User = $mol_data_record({ age: $mol_data_number, name: $mol_data_string });
                User({ age: 0 });
            }, '["name"] undefined is not a string');
        },
        'Shrinks deep record'() {
            $mol_assert_fail(() => {
                const User = $mol_data_record({ wife: $mol_data_record({ age: $mol_data_number }) });
                User({ wife: {} });
            }, '["wife"] ["age"] undefined is not a number');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Is empty array'() {
            $mol_data_array($mol_data_number)([]);
        },
        'Is array'() {
            $mol_data_array($mol_data_number)([1, 2]);
        },
        'Is not array'() {
            $mol_assert_fail(() => {
                $mol_data_array($mol_data_number)({ [0]: 1, length: 1, map: () => { } });
            }, '[object Object] is not an array');
        },
        'Has wrong item'() {
            $mol_assert_fail(() => {
                $mol_data_array($mol_data_number)([1, '1']);
            }, '[1] 1 is not a number');
        },
        'Has wrong deep item'() {
            $mol_assert_fail(() => {
                $mol_data_array($mol_data_array($mol_data_number))([[], [0, 0, false]]);
            }, '[1] [2] false is not a number');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Is boolean - true'() {
            $mol_data_boolean(true);
        },
        'Is boolean - false'() {
            $mol_data_boolean(false);
        },
        'Is not boolean'() {
            $mol_assert_fail(() => {
                $mol_data_boolean('x');
            }, 'x is not a boolean');
        },
        'Is object boolean'() {
            $mol_assert_fail(() => {
                $mol_data_boolean(new Boolean(''));
            }, 'false is not a boolean');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    /**
     * Checks for value of given enum and returns expected type.
     * @see https://mol.hyoo.ru/#!section=demos/demo=mol_data_enum_demo
     */
    function $mol_data_enum(name, dict) {
        const index = {};
        for (let key in dict) {
            if (Number.isNaN(Number(key))) {
                index[dict[key]] = key;
            }
        }
        return $mol_data_setup((value) => {
            if (typeof index[value] !== 'string') {
                return $mol_fail(new $mol_data_error(`${value} is not value of ${name} enum`));
            }
            return value;
        }, { name, dict });
    }
    $.$mol_data_enum = $mol_data_enum;
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    let sex;
    (function (sex) {
        sex[sex["male"] = 0] = "male";
        sex[sex["female"] = 1] = "female";
    })(sex || (sex = {}));
    let gender;
    (function (gender) {
        gender["bisexual"] = "bisexual";
        gender["trans"] = "transgender";
    })(gender || (gender = {}));
    // Test disabled due https://github.com/microsoft/TypeScript/issues/46112
    // const Sex = $mol_data_enum( 'sex' , sex )
    // type sex_value =  $mol_type_assert< typeof Sex.Value , sex >
    $mol_test({
        'config of enum'() {
            const Sex = $mol_data_enum('sex', sex);
            $mol_assert_like(Sex.config, {
                name: 'sex',
                dict: sex,
            });
        },
        'name of enum'() {
            const Sex = $mol_data_enum('sex', sex);
            $mol_assert_equal(Sex.config.name, 'sex');
        },
        'Is right value of enum'() {
            const Sex = $mol_data_enum('sex', sex);
            $mol_assert_equal(Sex(0), sex.male);
        },
        'Is wrong value of enum'() {
            const Sex = $mol_data_enum('sex', sex);
            $mol_assert_fail(() => Sex(2), `2 is not value of sex enum`);
        },
        'Is name instead of value'() {
            const Sex = $mol_data_enum('sex', sex);
            $mol_assert_fail(() => Sex('male'), `male is not value of sex enum`);
        },
        'Is common object field'() {
            const Sex = $mol_data_enum('sex', sex);
            $mol_assert_fail(() => Sex('__proto__'), `__proto__ is not value of sex enum`);
        },
    });
    // Test disabled due https://github.com/microsoft/TypeScript/issues/46112
    // type gender_value =  $mol_type_assert< typeof Gender.Value , gender >
    $mol_test({
        'config of enum'() {
            const Gender = $mol_data_enum('gender', gender);
            $mol_assert_like(Gender.config, {
                name: 'gender',
                dict: gender,
            });
        },
        'Is right value of enum'() {
            const Gender = $mol_data_enum('gender', gender);
            $mol_assert_equal(Gender('transgender'), gender.trans);
        },
        'Is wrong value of enum'() {
            const Gender = $mol_data_enum('gender', gender);
            $mol_assert_fail(() => Gender('xxx'), `xxx is not value of gender enum`);
        },
        'Is name instead of value'() {
            const Gender = $mol_data_enum('gender', gender);
            $mol_assert_fail(() => Gender('trans'), `trans is not value of gender enum`);
        },
        'Is common object field'() {
            const Gender = $mol_data_enum('gender', gender);
            $mol_assert_fail(() => Gender('__proto__'), `__proto__ is not value of gender enum`);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'type safe build & parse'() {
            let States;
            (function (States) {
                States["opened"] = "opened";
                States["closed"] = "closed";
            })(States || (States = {}));
            const State = $hyoo_harp_scheme({}, $mol_data_enum('States', States));
            const Str = $hyoo_harp_scheme({}, $mol_data_string);
            const Bool = $hyoo_harp_scheme({}, $mol_data_boolean);
            const Repository = $hyoo_harp_scheme({
                name: $mol_data_optional(Str),
                isPrivate: $mol_data_optional(Bool),
                // pullRequests: PullRequest,
            });
            const PullRequest = $hyoo_harp_scheme({
                state: $mol_data_optional(State),
                updated_at: $mol_data_optional(Str),
                repository: $mol_data_optional(Repository),
            });
            const Request = $hyoo_harp_scheme({
                pullRequest: $mol_data_optional(PullRequest),
            });
            const uri = 'pullRequest(state=closed=;-updated_at;repository(name;isPrivate);_num=0@100=)';
            let query = Request({
                pullRequest: {
                    state: { '=': [[States.closed]] }, // filter
                    updated_at: { '+': false }, // order
                    repository: {
                        name: {},
                        isPrivate: {},
                    },
                    _num: { '=': [[0, 100]] }, // slice
                }
            });
            $mol_assert_like(uri, Request.build(query));
            $mol_assert_like(query, Request.parse(uri));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'save and load buffers'($) {
            const land = $giper_baza_land.make({ $ });
            const file = land.Data($giper_baza_file);
            const source = new Uint8Array(2 ** 15 + 1);
            source[2 ** 15] = 255;
            file.buffer(source);
            $mol_assert_equal(file.chunks().length, 2);
            $mol_assert_equal(file.buffer(), source);
        },
        async 'save and load blobs'($) {
            const land = $giper_baza_land.make({ $ });
            const file = land.Data($giper_baza_file);
            const source = new Uint8Array(2 ** 16 + 1);
            source[2 ** 16 + 1] = 255;
            await $mol_wire_async(file).blob(new $mol_blob([source], { type: 'test/test' }));
            $mol_assert_equal('test/test', file.blob().type);
            $mol_assert_equal(source, new Uint8Array(await file.blob().arrayBuffer()));
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    /** Google Docs: wrapper b with normal weight, styled spans, c1 c2 classes, docs-internal-guid. */
    const paste_fixture_gdocs = `<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-9f1e2b3c-7fff-aaaa-bbbb-ccccdddd"><h1 dir="ltr" style="line-height:1.38;margin-top:20pt;margin-bottom:6pt;"><span style="font-size:20pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">Планы на квартал</span></h1><p dir="ltr" style="line-height:1.38;"><span class="c1 c5" style="font-size:11pt;font-family:Arial;font-weight:700;text-decoration:none;white-space:pre-wrap;">Важно</span><span class="c1" style="font-size:11pt;font-weight:400;text-decoration:none;white-space:pre-wrap;">:&nbsp;успеть до </span><span class="c3" style="font-size:11pt;font-style:italic;white-space:pre-wrap;">пятницы</span></p><p dir="ltr"><span style="text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;"><a class="c9" href="https://example.com/plan">план</a></span></p><ul style="margin-top:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;" aria-level="1"><p dir="ltr" style="line-height:1.38;" role="presentation"><span style="font-weight:400;white-space:pre-wrap;">Первый пункт</span></p></li><li dir="ltr" style="list-style-type:disc;" aria-level="1"><p dir="ltr" role="presentation"><span style="font-weight:400;">Второй пункт</span></p></li></ul></b>`;
    /** Word: o:p and w:sdt tags, mso-* styles, MsoListParagraph items, conditional comments. */
    const paste_fixture_word = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta name=Generator content="Microsoft Word 15"><style><!-- p.MsoNormal {margin:0cm;font-size:11.0pt;} --></style></head><body lang=RU><p class=MsoNormal><span style='font-size:12.0pt;mso-fareast-language:EN-US'>Обычный абзац с <b style='mso-bidi-font-weight:normal'>жирным</b> словом<o:p></o:p></span></p><p class=MsoListParagraphCxSpFirst style='margin-left:36.0pt;text-indent:-18.0pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span style='font-family:Symbol;mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><![endif]><span style='mso-fareast-language:EN-US'>Пункт один<o:p></o:p></span></p><p class=MsoListParagraphCxSpLast style='mso-list:l0 level1 lfo1'><![if !supportLists]><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span><![endif]><span>Пункт два<o:p></o:p></span></p><w:sdt><p class=MsoNormal>Служебное<o:p></o:p></p></w:sdt></body></html>`;
    /** Notion: block ids, data-token-index, nested list, pre code with language, figure with img. */
    const paste_fixture_notion = `<meta charset='utf-8'><span data-token-index="0" style="caret-color: rgb(55, 53, 47); font-family: ui-sans-serif;"></span><h2 id="1a2b3c4d-0000-8000-8000-000000000001" data-block-id="1a2b" class="notion-heading">Как это работает</h2><p id="1a2b3c4d-0000-8000-8000-000000000002" class="notion-text-block">Просто <strong>берём</strong> и <em>делаем</em>, смотри <a href="https://notion.so/doc">доку</a>.</p><ul class="bulleted-list"><li style="list-style-type:disc">раз<ul class="bulleted-list"><li style="list-style-type:circle">раз-раз</li></ul></li><li style="list-style-type:disc">два</li></ul><pre class="code" style="background:rgb(247,246,243);"><code class="language-TypeScript">const a: number = 1
console.log( a &lt; 2 )</code></pre><figure><img src="https://notion.so/image/pic.png" alt="скрин" width="700"></figure>`;
    /** Ordinary web page: article markup, blockquote, hr, table, script, hidden div, unsafe link. */
    const paste_fixture_web = `<article><h1 class="post-title">Заголовок статьи</h1><p>Текст с <strong>жирным</strong>, <em>курсивом</em>, <s>зачёркнутым</s> и <code>inline_code()</code>.</p><blockquote><p>Первая строка цитаты.</p><p>Вторая строка.</p></blockquote><hr><h4>Мелкий заголовок</h4><ol><li>Раз</li><li>Два</li></ol><pre><code class="language-js">let x = 1 &amp;&amp; 2</code></pre><p><img src="/img/photo.jpg" alt="фото"></p><p><a href="javascript:alert(1)">не ссылка</a> и <a href="https://ok.example/a?b=1&amp;c=2">ссылка</a></p><table><tr><th>Ключ</th><th>Значение</th></tr><tr><td>a</td><td>1</td></tr></table><script>alert(2)</script><div style="display:none">скрытое</div><!-- комментарий --></article>`;
    const paste_fixture_md = [
        '# Заголовок',
        '',
        'Абзац с **жирным**, *курсивом*, ~~зачёркнутым~~, `кодом` и [ссылкой](https://example.com/a?b=1&c=2).',
        '',
        '## Подзаголовок',
        '',
        '- раз',
        '- два',
        '  - вложенный',
        '',
        '1. один',
        '2. два',
        '',
        '> Цитата первая',
        '> Цитата вторая',
        '',
        '```ts',
        'const a = 1 < 2',
        '```',
        '',
        '---',
        '',
        '![картинка](https://example.com/pic.png)',
        '',
        '| Ключ | Значение |',
        '| --- | --- |',
        '| a | 1 |',
    ].join('\n');
    /** Anything an editor leaves behind that must never reach a block. */
    const paste_dirt = /style=|data-[a-z]|aria-|<span|<div|<o:p|<w:|docs-internal-guid|&nbsp;|\u00A0|<!--|role=/;
    function paste_dirty(drafts) {
        return drafts.filter(draft => paste_dirt.test(draft.content)).map(draft => draft.content);
    }
    /** class= is junk everywhere except the language marker of a code block. */
    function paste_classy(drafts) {
        return drafts.filter(draft => draft.type !== 'code' && draft.content.includes('class=')).map(draft => draft.content);
    }
    function paste_types(drafts) {
        return drafts.map(draft => draft.type);
    }
    function paste_clipboard(html, text) {
        return { getData: (type) => type === 'text/html' ? html : text };
    }
    $mol_test({
        'detect: rich html wins over plain text'() {
            const kind = $bog_wysiwyg_paste.detect(paste_clipboard(paste_fixture_gdocs, 'Планы на квартал'));
            $mol_assert_equal(kind, 'html');
        },
        'detect: code editor html is only colored spans, so markdown from plain text'() {
            const html = '<div style="color:#d4d4d4;background:#1e1e1e"><div><span style="color:#569cd6"># Привет</span></div></div>';
            const kind = $bog_wysiwyg_paste.detect(paste_clipboard(html, '# Привет\n\n- раз\n- два'));
            $mol_assert_equal(kind, 'markdown');
        },
        'detect: markdown from plain text when html is absent'() {
            $mol_assert_equal($bog_wysiwyg_paste.detect(paste_clipboard('', '# Привет')), 'markdown');
            $mol_assert_equal($bog_wysiwyg_paste.detect(paste_clipboard('', '- раз\n- два')), 'markdown');
            $mol_assert_equal($bog_wysiwyg_paste.detect(paste_clipboard('', 'см. [доку](https://x.dev)')), 'markdown');
            $mol_assert_equal($bog_wysiwyg_paste.detect(paste_clipboard('', '```\ncode\n```')), 'markdown');
            $mol_assert_equal($bog_wysiwyg_paste.detect(paste_clipboard('', '> цитата')), 'markdown');
        },
        'detect: prose without markup is plain text'() {
            const text = 'Просто две строки обычного текста.\nБез всякой разметки.';
            $mol_assert_equal($bog_wysiwyg_paste.detect(paste_clipboard('', text)), 'text');
            $mol_assert_equal($bog_wysiwyg_paste.detect(paste_clipboard('<span style="color:red">' + text + '</span>', text)), 'text');
        },
        'detect: bold span in html counts as rich'() {
            const html = '<span style="font-weight:700">важно</span>';
            $mol_assert_equal($bog_wysiwyg_paste.detect(paste_clipboard(html, 'важно')), 'html');
        },
        'from_html: google docs keeps structure and drops wrappers'() {
            const drafts = $bog_wysiwyg_paste.from_html(paste_fixture_gdocs);
            $mol_assert_equal(paste_types(drafts), ['heading', 'paragraph', 'paragraph', 'list', 'list']);
            $mol_assert_equal(drafts[0], { type: 'heading', level: 1, content: 'Планы на квартал' });
            $mol_assert_equal(drafts[1].content, '<b>Важно</b>: успеть до <i>пятницы</i>');
            $mol_assert_equal(drafts[2].content, '<a href="https://example.com/plan">план</a>');
            $mol_assert_equal(drafts[3].content, 'Первый пункт');
            $mol_assert_equal(drafts[4].content, 'Второй пункт');
            $mol_assert_equal(paste_dirty(drafts), []);
            $mol_assert_equal(paste_classy(drafts), []);
        },
        'from_html: word keeps bold and list items, drops office tags'() {
            const drafts = $bog_wysiwyg_paste.from_html(paste_fixture_word);
            $mol_assert_equal(paste_types(drafts), ['paragraph', 'list', 'list', 'paragraph']);
            $mol_assert_equal(drafts[0].content, 'Обычный абзац с <b>жирным</b> словом');
            $mol_assert_equal(drafts[1].content, 'Пункт один');
            $mol_assert_equal(drafts[2].content, 'Пункт два');
            $mol_assert_equal(drafts[3].content, 'Служебное');
            $mol_assert_equal(paste_dirty(drafts), []);
            $mol_assert_equal(paste_classy(drafts), []);
        },
        'from_html: notion flattens nested list and keeps code language'() {
            const drafts = $bog_wysiwyg_paste.from_html(paste_fixture_notion);
            $mol_assert_equal(paste_types(drafts), ['heading', 'paragraph', 'list', 'list', 'list', 'code', 'image']);
            $mol_assert_equal(drafts[0], { type: 'heading', level: 2, content: 'Как это работает' });
            $mol_assert_equal(drafts[1].content, 'Просто <b>берём</b> и <i>делаем</i>, смотри <a href="https://notion.so/doc">доку</a>.');
            $mol_assert_equal([drafts[2].content, drafts[3].content, drafts[4].content], ['раз', 'раз-раз', 'два']);
            $mol_assert_equal(drafts[5].content, '<code class="language-typescript">const a: number = 1\nconsole.log( a &lt; 2 )</code>');
            $mol_assert_equal(drafts[6].content, '<img src="https://notion.so/image/pic.png" alt="скрин">');
            $mol_assert_equal(paste_dirty(drafts), []);
            $mol_assert_equal(paste_classy(drafts), []);
        },
        'from_html: web page keeps every supported block type'() {
            const drafts = $bog_wysiwyg_paste.from_html(paste_fixture_web);
            $mol_assert_equal(paste_types(drafts), [
                'heading', 'paragraph', 'quote', 'divider', 'heading',
                'list', 'list', 'code', 'image', 'paragraph', 'paragraph', 'paragraph',
            ]);
            $mol_assert_equal(drafts[1].content, 'Текст с <b>жирным</b>, <i>курсивом</i>, <s>зачёркнутым</s> и <code>inline_code()</code>.');
            $mol_assert_equal(drafts[2].content, 'Первая строка цитаты.<br>Вторая строка.');
            $mol_assert_equal(drafts[4], { type: 'heading', level: 3, content: 'Мелкий заголовок' });
            $mol_assert_equal(drafts[7].content, '<code class="language-js">let x = 1 &amp;&amp; 2</code>');
            $mol_assert_equal(drafts[8].content, '<img src="/img/photo.jpg" alt="фото">');
            $mol_assert_equal(drafts[10].content, 'Ключ | Значение');
            $mol_assert_equal(drafts[11].content, 'a | 1');
            $mol_assert_equal(paste_dirty(drafts), []);
            $mol_assert_equal(paste_classy(drafts), []);
        },
        'from_html: unsafe hrefs are unwrapped to plain text'() {
            const drafts = $bog_wysiwyg_paste.from_html(paste_fixture_web);
            $mol_assert_equal(drafts[9].content, 'не ссылка и <a href="https://ok.example/a?b=1&amp;c=2">ссылка</a>');
            $mol_assert_equal(drafts[9].content.includes('javascript:'), false);
        },
        'from_html: script and hidden content never reach a block'() {
            const drafts = $bog_wysiwyg_paste.from_html(paste_fixture_web);
            const all = drafts.map(draft => draft.content).join(' ');
            $mol_assert_equal(all.includes('alert'), false);
            $mol_assert_equal(all.includes('скрытое'), false);
            $mol_assert_equal(all.includes('комментарий'), false);
        },
        'from_html: empty and junk only clipboard gives nothing'() {
            $mol_assert_equal($bog_wysiwyg_paste.from_html(''), []);
            $mol_assert_equal($bog_wysiwyg_paste.from_html('   '), []);
            $mol_assert_equal($bog_wysiwyg_paste.from_html('<meta charset="utf-8"><span style="color:red"></span>'), []);
            $mol_assert_equal($bog_wysiwyg_paste.from_html('<div><span> </span></div>'), []);
        },
        'from_html: nbsp becomes an ordinary space'() {
            const drafts = $bog_wysiwyg_paste.from_html('<p>раз&nbsp;два&nbsp;&nbsp;три</p>');
            $mol_assert_equal(drafts[0].content, 'раз два три');
        },
        'from_html: data uri image is passed through untouched'() {
            const src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==';
            const drafts = $bog_wysiwyg_paste.from_html('<p><img src="' + src + '"></p>');
            $mol_assert_equal(drafts, [{ type: 'image', content: '<img src="' + src + '">' }]);
        },
        'from_html: image inside a paragraph splits it into blocks in order'() {
            const drafts = $bog_wysiwyg_paste.from_html('<p>до<img src="a.png">после</p>');
            $mol_assert_equal(drafts, [
                { type: 'paragraph', content: 'до' },
                { type: 'image', content: '<img src="a.png">' },
                { type: 'paragraph', content: 'после' },
            ]);
        },
        'from_html: text in a styled span keeps the spaces around neighbours'() {
            const html = '<p><span style="color:#111">жирный</span><span> </span><span style="font-weight:700">текст</span></p>';
            $mol_assert_equal($bog_wysiwyg_paste.from_html(html)[0].content, 'жирный <b>текст</b>');
        },
        'from_html: angle brackets in text are escaped'() {
            const drafts = $bog_wysiwyg_paste.from_html('<p>&lt;b&gt;не жирный&lt;/b&gt; &amp; всё</p>');
            $mol_assert_equal(drafts[0].content, '&lt;b&gt;не жирный&lt;/b&gt; &amp; всё');
        },
        'from_markdown: every block kind is recognised'() {
            const drafts = $bog_wysiwyg_paste.from_markdown(paste_fixture_md);
            $mol_assert_equal(paste_types(drafts), [
                'heading', 'paragraph', 'heading', 'list', 'list', 'list', 'list', 'list',
                'quote', 'code', 'divider', 'image', 'paragraph', 'paragraph',
            ]);
            $mol_assert_equal(drafts[0], { type: 'heading', level: 1, content: 'Заголовок' });
            $mol_assert_equal(drafts[1].content, 'Абзац с <b>жирным</b>, <i>курсивом</i>, <s>зачёркнутым</s>, <code>кодом</code>'
                + ' и <a href="https://example.com/a?b=1&amp;c=2">ссылкой</a>.');
            $mol_assert_equal(drafts[2], { type: 'heading', level: 2, content: 'Подзаголовок' });
            $mol_assert_equal(drafts.slice(3, 8).map(draft => draft.content), ['раз', 'два', 'вложенный', 'один', 'два']);
            $mol_assert_equal(drafts[8].content, 'Цитата первая<br>Цитата вторая');
            $mol_assert_equal(drafts[9].content, '<code class="language-ts">const a = 1 &lt; 2</code>');
            $mol_assert_equal(drafts[10], { type: 'divider', content: '' });
            $mol_assert_equal(drafts[11].content, '<img src="https://example.com/pic.png" alt="картинка">');
            $mol_assert_equal([drafts[12].content, drafts[13].content], ['Ключ | Значение', 'a | 1']);
            $mol_assert_equal(paste_dirty(drafts), []);
            $mol_assert_equal(paste_classy(drafts), []);
        },
        'from_markdown: heading deeper than three is clamped'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('#### Четвёртый\n\n###### Шестой');
            $mol_assert_equal(drafts.map(draft => draft.level), [3, 3]);
        },
        'from_markdown: fence without language stays plain code'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('```\nplain & <code>\n```');
            $mol_assert_equal(drafts, [{ type: 'code', content: 'plain &amp; &lt;code&gt;' }]);
        },
        'from_markdown: tilde fence works too'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('~~~python\nx = 1\n~~~');
            $mol_assert_equal(drafts, [{ type: 'code', content: '<code class="language-python">x = 1</code>' }]);
        },
        'from_markdown: raw html in the source is escaped, not executed'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('опасно <script>alert(1)</script> тут');
            $mol_assert_equal(drafts[0].content, 'опасно &lt;script&gt;alert(1)&lt;/script&gt; тут');
        },
        'from_markdown: unsafe link becomes plain label'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('[клик](javascript:alert(1))');
            $mol_assert_equal(drafts, [{ type: 'paragraph', content: 'клик' }]);
        },
        'from_markdown: soft line breaks inside a paragraph become br'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('первая\nвторая\n\nтретья');
            $mol_assert_equal(drafts, [
                { type: 'paragraph', content: 'первая<br>вторая' },
                { type: 'paragraph', content: 'третья' },
            ]);
        },
        'from_markdown: dashes are a divider, not a list'() {
            $mol_assert_equal($bog_wysiwyg_paste.from_markdown('---'), [{ type: 'divider', content: '' }]);
            $mol_assert_equal($bog_wysiwyg_paste.from_markdown('***'), [{ type: 'divider', content: '' }]);
            $mol_assert_equal($bog_wysiwyg_paste.from_markdown('- пункт'), [{ type: 'list', content: 'пункт' }]);
        },
        'from_markdown: emphasis inside a word is left alone'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('snake_case_name и 2*3*4');
            $mol_assert_equal(drafts[0].content, 'snake_case_name и 2*3*4');
        },
        'from_markdown: parens inside a link url survive'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('см. [вики](https://ru.wikipedia.org/wiki/Мол_(язык))');
            $mol_assert_equal(drafts[0].content, 'см. <a href="https://ru.wikipedia.org/wiki/Мол_(язык)">вики</a>');
        },
        'from_markdown: image with a title keeps only the source'() {
            const drafts = $bog_wysiwyg_paste.from_markdown('![схема](https://x.dev/a.png "подпись")');
            $mol_assert_equal(drafts, [{ type: 'image', content: '<img src="https://x.dev/a.png" alt="схема">' }]);
        },
        'from_html: underline survives when it is not a link decoration'() {
            const drafts = $bog_wysiwyg_paste.from_html('<p>вот <u>это</u> и <span style="text-decoration:underline">то</span></p>');
            $mol_assert_equal(drafts[0].content, 'вот <u>это</u> и <u>то</u>');
        },
        'from_markdown: nothing from empty source'() {
            $mol_assert_equal($bog_wysiwyg_paste.from_markdown(''), []);
            $mol_assert_equal($bog_wysiwyg_paste.from_markdown('\n\n   \n'), []);
        },
        'from_text: blank lines split paragraphs, single breaks stay'() {
            const drafts = $bog_wysiwyg_paste.from_text('один\nдва\n\nтри & <четыре>');
            $mol_assert_equal(drafts, [
                { type: 'paragraph', content: 'один<br>два' },
                { type: 'paragraph', content: 'три &amp; &lt;четыре&gt;' },
            ]);
        },
        'from_data: routes to the parser matching the clipboard'() {
            const from_html = $bog_wysiwyg_paste.from_data(paste_clipboard('<h2>Тема</h2>', 'Тема'));
            $mol_assert_equal(from_html, [{ type: 'heading', level: 2, content: 'Тема' }]);
            const from_md = $bog_wysiwyg_paste.from_data(paste_clipboard('', '## Тема'));
            $mol_assert_equal(from_md, [{ type: 'heading', level: 2, content: 'Тема' }]);
            const from_text = $bog_wysiwyg_paste.from_data(paste_clipboard('', 'просто тема'));
            $mol_assert_equal(from_text, [{ type: 'paragraph', content: 'просто тема' }]);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        /** Helper: create a contenteditable div with text, place cursor at end, run try_markdown */
        function apply_markdown(input) {
            const doc = $mol_dom_context.document;
            const div = doc.createElement('div');
            div.contentEditable = 'true';
            doc.body.appendChild(div);
            try {
                div.textContent = input;
                const text_node = div.firstChild;
                const sel = doc.defaultView.getSelection();
                const range = doc.createRange();
                range.setStart(text_node, input.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                const block = new $bog_wysiwyg_block();
                block.try_markdown(div);
                return div.innerHTML;
            }
            finally {
                doc.body.removeChild(div);
            }
        }
        function make_block_with_selection(html, select_text) {
            const doc = $mol_dom_context.document;
            const div = doc.createElement('div');
            div.contentEditable = 'true';
            div.innerHTML = html;
            doc.body.appendChild(div);
            div.focus();
            if (select_text) {
                const walker = doc.createTreeWalker(div, 4 /* NodeFilter.SHOW_TEXT */);
                let node;
                while (node = walker.nextNode()) {
                    const idx = (node.textContent ?? '').indexOf(select_text);
                    if (idx >= 0) {
                        const range = doc.createRange();
                        range.setStart(node, idx);
                        range.setEnd(node, idx + select_text.length);
                        const sel = doc.defaultView.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                        break;
                    }
                }
            }
            return div;
        }
        /** Editable node plus a block view bound to it */
        function make_block(html) {
            const doc = $mol_dom_context.document;
            const node = doc.createElement('div');
            node.contentEditable = 'true';
            // jsdom only tracks activeElement for focusable areas
            node.tabIndex = 0;
            node.innerHTML = html;
            doc.body.appendChild(node);
            const block = new $bog_wysiwyg_block();
            block.dom_node = () => node;
            block.html = (next) => next ?? node.innerHTML;
            const calls = [];
            for (const name of ['on_enter', 'on_remove', 'on_split', 'on_merge_prev', 'on_merge_next', 'on_nav', 'on_input', 'on_slash', 'on_paste_blocks', 'on_image']) {
                block[name] = (arg) => {
                    calls.push({ name, arg });
                    return arg ?? null;
                };
            }
            return { block, node, calls, drop: () => node.remove() };
        }
        function set_caret(node, offset) {
            const doc = $mol_dom_context.document;
            const point = $bog_wysiwyg_point_at(node, offset);
            const range = doc.createRange();
            range.setStart(point.node, point.offset);
            range.collapse(true);
            const sel = doc.defaultView.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        function set_range(node, from, to) {
            const doc = $mol_dom_context.document;
            const start = $bog_wysiwyg_point_at(node, from);
            const end = $bog_wysiwyg_point_at(node, to);
            const range = doc.createRange();
            range.setStart(start.node, start.offset);
            range.setEnd(end.node, end.offset);
            const sel = doc.defaultView.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        function key(name, mods = {}) {
            return new KeyboardEvent('keydown', { key: name, cancelable: true, ...mods });
        }
        /** Bare clipboard: `paste_data` needs nothing but `getData` */
        function clipboard(parts) {
            return {
                getData: (type) => (type === 'text/html' ? parts.html : parts.text) ?? '',
            };
        }
        $mol_test({
            // === Text offsets ===
            'point_at walks through nested inline tags'() {
                const { node, drop } = make_block('ab<b>cd</b>ef');
                try {
                    $mol_assert_equal($bog_wysiwyg_point_at(node, 0).offset, 0);
                    $mol_assert_equal($bog_wysiwyg_point_at(node, 3).node.data, 'cd');
                    $mol_assert_equal($bog_wysiwyg_point_at(node, 3).offset, 1);
                    $mol_assert_equal($bog_wysiwyg_point_at(node, 6).node.data, 'ef');
                    $mol_assert_equal($bog_wysiwyg_point_at(node, 6).offset, 2);
                }
                finally {
                    drop();
                }
            },
            'point_at clamps beyond the end'() {
                const { node, drop } = make_block('abc');
                try {
                    $mol_assert_equal($bog_wysiwyg_point_at(node, 100).offset, 3);
                }
                finally {
                    drop();
                }
            },
            'offset_of is inverse of point_at'() {
                const { node, drop } = make_block('ab<b>cd</b>ef');
                try {
                    for (let i = 0; i <= 6; i++) {
                        const point = $bog_wysiwyg_point_at(node, i);
                        $mol_assert_equal($bog_wysiwyg_offset_of(node, point.node, point.offset), i);
                    }
                }
                finally {
                    drop();
                }
            },
            'offset_of rejects a node outside the block'() {
                const { node, drop } = make_block('abc');
                const other = $mol_dom_context.document.createElement('div');
                try {
                    $mol_assert_equal($bog_wysiwyg_offset_of(node, other, 0), -1);
                }
                finally {
                    drop();
                }
            },
            'html_text strips markup'() {
                $mol_assert_equal($bog_wysiwyg_html_text($mol_dom_context.document, 'a<b>b</b><i>c</i>'), 'abc');
            },
            'escape_html protects angle brackets'() {
                $mol_assert_equal($bog_wysiwyg_escape_html('<&>'), '&lt;&amp;&gt;');
            },
            // === Caret ===
            'caret_offset counts through inline tags'() {
                const { block, node, drop } = make_block('ab<b>cd</b>ef');
                try {
                    set_caret(node, 5);
                    $mol_assert_equal(block.caret_offset(), 5);
                }
                finally {
                    drop();
                }
            },
            'caret_offset is -1 when the caret is in another block'() {
                const one = make_block('first');
                const two = make_block('second');
                try {
                    set_caret(two.node, 2);
                    $mol_assert_equal(one.block.caret_offset(), -1);
                }
                finally {
                    one.drop();
                    two.drop();
                }
            },
            'caret survives an innerHTML rewrite'() {
                const { block, node, drop } = make_block('hello world');
                try {
                    set_caret(node, 5);
                    const offset = block.caret_offset();
                    // Nodes are recreated, the old Range would be lost
                    node.innerHTML = 'hello <b>world</b>';
                    block.caret_place(offset);
                    $mol_assert_equal(block.caret_offset(), 5);
                }
                finally {
                    drop();
                }
            },
            'auto keeps the caret when the focused block is resynced'() {
                const { block, node, drop } = make_block('hello world');
                try {
                    node.focus();
                    set_caret(node, 5);
                    block.html = (next) => next ?? 'hello <b>world</b>';
                    block.auto();
                    $mol_assert_equal(node.innerHTML, 'hello <b>world</b>');
                    $mol_assert_equal(block.caret_offset(), 5);
                }
                finally {
                    drop();
                }
            },
            'auto rewrites an unfocused block without touching the selection'() {
                const { block, node, drop } = make_block('old');
                const other = make_block('elsewhere');
                try {
                    set_caret(other.node, 3);
                    block.html = (next) => next ?? 'new';
                    block.auto();
                    $mol_assert_equal(node.innerHTML, 'new');
                    $mol_assert_equal(other.block.caret_offset(), 3);
                }
                finally {
                    drop();
                    other.drop();
                }
            },
            'focus_at clamps the offset to the text length'() {
                const { block, node, drop } = make_block('abc');
                try {
                    block.focus_at(100);
                    $mol_assert_equal(block.caret_offset(), 3);
                }
                finally {
                    drop();
                }
            },
            // === Splitting content ===
            'html_before and html_after keep markup'() {
                const { block, drop } = make_block('ab<b>cdef</b>gh');
                try {
                    $mol_assert_equal(block.html_before(4), 'ab<b>cd</b>');
                    $mol_assert_equal(block.html_after(4), '<b>ef</b>gh');
                }
                finally {
                    drop();
                }
            },
            'html_before at zero is empty and html_after at zero is everything'() {
                const { block, drop } = make_block('a<i>b</i>');
                try {
                    $mol_assert_equal(block.html_before(0), '');
                    $mol_assert_equal(block.html_after(0), 'a<i>b</i>');
                }
                finally {
                    drop();
                }
            },
            'Enter in the middle asks the page to split the block'() {
                const { block, node, calls, drop } = make_block('hello world');
                try {
                    set_caret(node, 5);
                    block.keydown_event(key('Enter'));
                    $mol_assert_equal(calls.length, 1);
                    $mol_assert_equal(calls[0].name, 'on_split');
                    $mol_assert_equal(calls[0].arg, { head: 'hello', tail: ' world' });
                }
                finally {
                    drop();
                }
            },
            'Enter at the end appends a fresh block'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 5);
                    block.keydown_event(key('Enter'));
                    $mol_assert_equal(calls.length, 1);
                    $mol_assert_equal(calls[0].name, 'on_enter');
                }
                finally {
                    drop();
                }
            },
            'Enter at the start pushes the whole text into a new block'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 0);
                    block.keydown_event(key('Enter'));
                    $mol_assert_equal(calls[0].name, 'on_split');
                    $mol_assert_equal(calls[0].arg, { head: '', tail: 'hello' });
                }
                finally {
                    drop();
                }
            },
            'Enter on an empty block appends a fresh block'() {
                const { block, node, calls, drop } = make_block('');
                try {
                    set_caret(node, 0);
                    block.keydown_event(key('Enter'));
                    $mol_assert_equal(calls[0].name, 'on_enter');
                }
                finally {
                    drop();
                }
            },
            'Enter over a selection inside the block wipes it and splits there'() {
                const { block, node, calls, drop } = make_block('hello world');
                try {
                    set_range(node, 5, 8);
                    block.keydown_event(key('Enter'));
                    $mol_assert_equal(calls[0].name, 'on_split');
                    $mol_assert_equal(calls[0].arg, { head: 'hello', tail: 'rld' });
                }
                finally {
                    drop();
                }
            },
            'delete_range drops the selected content and keeps the caret'() {
                const { block, node, drop } = make_block('hello world');
                try {
                    set_range(node, 5, 8);
                    $mol_assert_equal(block.delete_range(), true);
                    $mol_assert_equal(node.textContent, 'hellorld');
                    $mol_assert_equal(block.caret_offset(), 5);
                }
                finally {
                    drop();
                }
            },
            'delete_range refuses a selection reaching outside the block'() {
                const one = make_block('first');
                const two = make_block('second');
                try {
                    const doc = $mol_dom_context.document;
                    const range = doc.createRange();
                    range.setStart(one.node.firstChild, 1);
                    range.setEnd(two.node.firstChild, 1);
                    const sel = doc.defaultView.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    $mol_assert_equal(one.block.delete_range(), false);
                    $mol_assert_equal(one.node.textContent, 'first');
                }
                finally {
                    one.drop();
                    two.drop();
                }
            },
            'Shift+Enter is left to the browser'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 2);
                    const event = key('Enter', { shiftKey: true });
                    block.keydown_event(event);
                    $mol_assert_equal(calls.length, 0);
                    $mol_assert_equal(event.defaultPrevented, false);
                }
                finally {
                    drop();
                }
            },
            // === Block boundaries ===
            'Backspace at the start of a filled block asks to merge with the previous'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 0);
                    const event = key('Backspace');
                    block.keydown_event(event);
                    $mol_assert_equal(calls[0].name, 'on_merge_prev');
                    $mol_assert_equal(event.defaultPrevented, true);
                }
                finally {
                    drop();
                }
            },
            'Backspace in the middle is left to the browser'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 3);
                    const event = key('Backspace');
                    block.keydown_event(event);
                    $mol_assert_equal(calls.length, 0);
                    $mol_assert_equal(event.defaultPrevented, false);
                }
                finally {
                    drop();
                }
            },
            'Backspace on an empty block still removes it'() {
                const { block, node, calls, drop } = make_block('');
                try {
                    set_caret(node, 0);
                    block.keydown_event(key('Backspace'));
                    $mol_assert_equal(calls[0].name, 'on_remove');
                }
                finally {
                    drop();
                }
            },
            'Backspace over a selection is left to the browser'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_range(node, 0, 3);
                    block.keydown_event(key('Backspace'));
                    $mol_assert_equal(calls.length, 0);
                }
                finally {
                    drop();
                }
            },
            'Delete at the end asks to pull the next block in'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 5);
                    const event = key('Delete');
                    block.keydown_event(event);
                    $mol_assert_equal(calls[0].name, 'on_merge_next');
                    $mol_assert_equal(event.defaultPrevented, true);
                }
                finally {
                    drop();
                }
            },
            'Delete in the middle is left to the browser'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 2);
                    const event = key('Delete');
                    block.keydown_event(event);
                    $mol_assert_equal(calls.length, 0);
                    $mol_assert_equal(event.defaultPrevented, false);
                }
                finally {
                    drop();
                }
            },
            // === Vertical navigation ===
            'caret_lines reports both edges without a layout engine'() {
                const { block, node, drop } = make_block('hello');
                try {
                    set_caret(node, 2);
                    const lines = block.caret_lines();
                    $mol_assert_equal(lines.first, true);
                    $mol_assert_equal(lines.last, true);
                }
                finally {
                    drop();
                }
            },
            'caret_lines reports both edges for an empty block'() {
                const { block, node, drop } = make_block('');
                try {
                    set_caret(node, 0);
                    $mol_assert_equal(block.caret_lines(), { first: true, last: true });
                }
                finally {
                    drop();
                }
            },
            'ArrowUp on the first line asks to step up'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 3);
                    const event = key('ArrowUp');
                    block.keydown_event(event);
                    $mol_assert_equal(calls[0].name, 'on_nav');
                    $mol_assert_equal(calls[0].arg, { dir: 'up', x: 0, offset: 3 });
                    $mol_assert_equal(event.defaultPrevented, true);
                }
                finally {
                    drop();
                }
            },
            'ArrowDown on the last line asks to step down'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 1);
                    block.keydown_event(key('ArrowDown'));
                    $mol_assert_equal(calls[0].name, 'on_nav');
                    $mol_assert_equal(calls[0].arg, { dir: 'down', x: 0, offset: 1 });
                }
                finally {
                    drop();
                }
            },
            'Shift+ArrowUp extends the selection instead of stepping'() {
                const { block, node, calls, drop } = make_block('hello');
                try {
                    set_caret(node, 3);
                    block.keydown_event(key('ArrowUp', { shiftKey: true }));
                    $mol_assert_equal(calls.length, 0);
                }
                finally {
                    drop();
                }
            },
            'focus_column falls back to the text offset without a layout engine'() {
                const { block, node, drop } = make_block('hello world');
                try {
                    block.focus_column(0, 4, true);
                    $mol_assert_equal(block.caret_offset(), 4);
                }
                finally {
                    drop();
                }
            },
            'focus_column clamps the offset to a shorter block'() {
                const { block, node, drop } = make_block('ab');
                try {
                    block.focus_column(0, 9, false);
                    $mol_assert_equal(block.caret_offset(), 2);
                }
                finally {
                    drop();
                }
            },
            // === Clipboard ===
            'a single unbroken line is pasted into the text, not into a block'() {
                const { block, node, calls, drop } = make_block('hello world');
                try {
                    set_caret(node, 6);
                    block.paste_data(clipboard({ text: 'dear' }));
                    const paste = calls[0];
                    $mol_assert_equal(paste.name, 'on_paste_blocks');
                    $mol_assert_equal(paste.arg, {
                        drafts: [{ type: 'paragraph', content: 'dear' }],
                        head: 'hello ',
                        tail: 'world',
                        inline: true,
                    });
                }
                finally {
                    drop();
                }
            },
            'spaces around a fragment copied mid sentence survive'() {
                const { block, node, calls, drop } = make_block('словоконец');
                try {
                    set_caret(node, 5);
                    block.paste_data(clipboard({ text: ' и ещё ' }));
                    const arg = calls[0].arg;
                    $mol_assert_equal(arg.drafts[0].content, ' и ещё ');
                }
                finally {
                    drop();
                }
            },
            'inline markdown in a single line still goes inline'() {
                const { block, node, calls, drop } = make_block('a');
                try {
                    set_caret(node, 1);
                    block.paste_data(clipboard({ text: 'очень **важно**' }));
                    const arg = calls[0].arg;
                    $mol_assert_equal(arg.inline, true);
                    $mol_assert_equal(arg.drafts[0].content, 'очень <b>важно</b>');
                }
                finally {
                    drop();
                }
            },
            'several markdown paragraphs become several drafts'() {
                const { block, node, calls, drop } = make_block('');
                try {
                    set_caret(node, 0);
                    block.paste_data(clipboard({ text: '# Заголовок\n\nАбзац\n\n- пункт' }));
                    const arg = calls[0].arg;
                    $mol_assert_equal(arg.inline, false);
                    $mol_assert_equal(arg.drafts.map(draft => draft.type), ['heading', 'paragraph', 'list']);
                }
                finally {
                    drop();
                }
            },
            'rich html wins over plain text'() {
                const { block, node, calls, drop } = make_block('');
                try {
                    set_caret(node, 0);
                    block.paste_data(clipboard({
                        html: '<h2>Тема</h2><p>Тело</p>',
                        text: 'Тема\nТело',
                    }));
                    const arg = calls[0].arg;
                    $mol_assert_equal(arg.drafts, [
                        { type: 'heading', level: 2, content: 'Тема' },
                        { type: 'paragraph', content: 'Тело' },
                    ]);
                }
                finally {
                    drop();
                }
            },
            'a paste in the middle carries both halves of the block'() {
                const { block, node, calls, drop } = make_block('ab<b>cd</b>ef');
                try {
                    set_caret(node, 3);
                    block.paste_data(clipboard({ text: 'раз\n\nдва' }));
                    const arg = calls[0].arg;
                    $mol_assert_equal(arg.inline, false);
                    $mol_assert_equal(arg.head, 'ab<b>c</b>');
                    $mol_assert_equal(arg.tail, '<b>d</b>ef');
                }
                finally {
                    drop();
                }
            },
            'a paste over a selection replaces exactly that range'() {
                const { block, node, calls, drop } = make_block('hello world');
                try {
                    set_range(node, 6, 11);
                    block.paste_data(clipboard({ text: 'there' }));
                    const arg = calls[0].arg;
                    $mol_assert_equal(arg.head, 'hello ');
                    $mol_assert_equal(arg.tail, '');
                }
                finally {
                    drop();
                }
            },
            'a code block takes the clipboard as plain text'() {
                const { block, node, calls, drop } = make_block('');
                try {
                    block.type = () => 'code';
                    set_caret(node, 0);
                    block.paste_data(clipboard({ html: '<h1>x</h1>', text: '<div>\n\tif( a && b ) c\n</div>' }));
                    const arg = calls[0].arg;
                    $mol_assert_equal(arg.inline, true);
                    $mol_assert_equal(arg.drafts, [
                        { type: 'code', content: '&lt;div&gt;\n\tif( a &amp;&amp; b ) c\n&lt;/div&gt;' },
                    ]);
                }
                finally {
                    drop();
                }
            },
            'an empty clipboard pastes nothing'() {
                const { block, node, calls, drop } = make_block('text');
                try {
                    set_caret(node, 0);
                    block.paste_data(clipboard({}));
                    $mol_assert_equal(calls.length, 0);
                }
                finally {
                    drop();
                }
            },
            'a clipboard of markup junk pastes nothing'() {
                const { block, node, calls, drop } = make_block('text');
                try {
                    set_caret(node, 0);
                    block.paste_data(clipboard({ html: '<meta charset="utf-8"><span style="color:red"></span>', text: '' }));
                    $mol_assert_equal(calls.length, 0);
                }
                finally {
                    drop();
                }
            },
            'a readonly block refuses the clipboard'() {
                const { block, drop } = make_block('text');
                try {
                    block.readonly = () => true;
                    const event = new ClipboardEvent('paste', { cancelable: true });
                    block.paste_event(event);
                    $mol_assert_equal(event.defaultPrevented, true);
                }
                finally {
                    drop();
                }
            },
            // === Input notification ===
            'input_event notifies the page'() {
                const { block, node, calls, drop } = make_block('hi');
                try {
                    const event = new Event('input');
                    Object.defineProperty(event, 'target', { value: node });
                    block.input_event(event);
                    $mol_assert_equal(calls.some(call => call.name === 'on_input'), true);
                }
                finally {
                    drop();
                }
            },
            'bold markdown converts to HTML'() {
                $mol_assert_equal(apply_markdown('hello **world** end'), 'hello <b>world</b> end');
            },
            'italic markdown converts to HTML'() {
                $mol_assert_equal(apply_markdown('hello *world* end'), 'hello <i>world</i> end');
            },
            'inline code markdown converts to HTML'() {
                $mol_assert_equal(apply_markdown('hello `code` end'), 'hello <code>code</code> end');
            },
            'strikethrough markdown converts to HTML'() {
                $mol_assert_equal(apply_markdown('hello ~~strike~~ end'), 'hello <s>strike</s> end');
            },
            'link markdown converts to HTML'() {
                const result = apply_markdown('click [here](https://example.com) now');
                $mol_assert_equal(result, 'click <a href="https://example.com">here</a> now');
            },
            'wiki link [[page_id]] converts to anchor'() {
                const result = apply_markdown('see [[my_page]] for info');
                $mol_assert_ok(result.includes('<a '));
                $mol_assert_ok(result.includes('data-wiki-link="my_page"'));
                $mol_assert_ok(result.includes('href="#my_page"'));
                $mol_assert_ok(result.includes('>my_page</a>'));
            },
            'wiki link with empty content does not convert'() {
                $mol_assert_equal(apply_markdown('hello [[]] end'), 'hello [[]] end');
            },
            'partially typed wiki link does not convert'() {
                $mol_assert_equal(apply_markdown('[[not closed'), '[[not closed');
            },
            'empty bold content does not convert'() {
                $mol_assert_equal(apply_markdown('hello **** end'), 'hello **** end');
            },
            'single star inside double stars does not break bold'() {
                const result = apply_markdown('**bold text** end');
                $mol_assert_equal(result, '<b>bold text</b> end');
            },
            'multiple patterns in one block: only first converts per pass'() {
                // First pass converts the first match
                const first = apply_markdown('**bold** and *italic*');
                $mol_assert_equal(first, '<b>bold</b> and *italic*');
            },
            'partially typed bold does not convert'() {
                $mol_assert_equal(apply_markdown('**not closed'), '**not closed');
            },
            'partially typed italic does not convert'() {
                $mol_assert_equal(apply_markdown('*not closed'), '*not closed');
            },
            'partially typed strikethrough does not convert'() {
                $mol_assert_equal(apply_markdown('~~not closed'), '~~not closed');
            },
            'partially typed link does not convert'() {
                $mol_assert_equal(apply_markdown('[text](no-close'), '[text](no-close');
            },
            'link with empty url does not convert'() {
                $mol_assert_equal(apply_markdown('[text]() end'), '[text]() end');
            },
            'link with empty text does not convert'() {
                $mol_assert_equal(apply_markdown('[](https://example.com) end'), '[](https://example.com) end');
            },
            'bold at start of text'() {
                $mol_assert_equal(apply_markdown('**start** rest'), '<b>start</b> rest');
            },
            'bold at end of text'() {
                $mol_assert_equal(apply_markdown('rest **end**'), 'rest <b>end</b>');
            },
            'code with special characters inside'() {
                $mol_assert_equal(apply_markdown('run `npm install` now'), 'run <code>npm install</code> now');
            },
            'strike_exec without event returns null'() {
                const block = new $bog_wysiwyg_block();
                $mol_assert_equal(block.strike_exec(), null);
            },
            'strike_exec wraps selection in strikethrough'() {
                if (typeof document === 'undefined')
                    return;
                const div = make_block_with_selection('hello world end', 'world');
                try {
                    const block = new $bog_wysiwyg_block();
                    block.dom_node = () => div;
                    block.html = (val) => val ?? div.innerHTML;
                    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true });
                    const result = block.strike_exec(event);
                    $mol_assert_ok(result);
                    $mol_assert_ok(div.innerHTML.includes('<strike>') || div.innerHTML.includes('<s>'));
                    $mol_assert_ok(div.innerHTML.includes('world'));
                }
                finally {
                    div.remove();
                }
            },
            'link_exec without event returns null'() {
                const block = new $bog_wysiwyg_block();
                $mol_assert_equal(block.link_exec(), null);
            },
            'link_exec with cancelled prompt does nothing'() {
                if (typeof document === 'undefined')
                    return;
                const div = make_block_with_selection('hello world end', 'world');
                try {
                    const original_prompt = globalThis.prompt;
                    globalThis.prompt = () => null;
                    const block = new $bog_wysiwyg_block();
                    block.dom_node = () => div;
                    block.html = (val) => val ?? div.innerHTML;
                    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                    const result = block.link_exec(event);
                    $mol_assert_ok(result);
                    $mol_assert_equal(div.innerHTML, 'hello world end');
                    globalThis.prompt = original_prompt;
                }
                finally {
                    div.remove();
                }
            },
            'link_exec creates link from selected text'() {
                if (typeof document === 'undefined')
                    return;
                const div = make_block_with_selection('click here now', 'here');
                try {
                    const original_prompt = globalThis.prompt;
                    globalThis.prompt = () => 'https://example.com';
                    const block = new $bog_wysiwyg_block();
                    block.dom_node = () => div;
                    block.html = (val) => val ?? div.innerHTML;
                    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                    block.link_exec(event);
                    $mol_assert_ok(div.innerHTML.includes('<a '));
                    $mol_assert_ok(div.innerHTML.includes('https://example.com'));
                    $mol_assert_ok(div.innerHTML.includes('here'));
                    globalThis.prompt = original_prompt;
                }
                finally {
                    div.remove();
                }
            },
            'link_exec inserts url as text when no selection'() {
                if (typeof document === 'undefined')
                    return;
                const div = make_block_with_selection('hello world');
                try {
                    div.focus();
                    // Place cursor at end without selecting
                    const sel = $mol_dom_context.document.defaultView.getSelection();
                    const range = $mol_dom_context.document.createRange();
                    range.selectNodeContents(div);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    const original_prompt = globalThis.prompt;
                    globalThis.prompt = () => 'https://example.com';
                    const block = new $bog_wysiwyg_block();
                    block.dom_node = () => div;
                    block.html = (val) => val ?? div.innerHTML;
                    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                    block.link_exec(event);
                    $mol_assert_ok(div.innerHTML.includes('<a '));
                    $mol_assert_ok(div.innerHTML.includes('https://example.com'));
                    globalThis.prompt = original_prompt;
                }
                finally {
                    div.remove();
                }
            },
            // === Image block ===
            'paste_event without event returns null'() {
                const block = new $bog_wysiwyg_block();
                $mol_assert_equal(block.paste_event(), null);
            },
            'paste_event with image prevents default'() {
                if (typeof document === 'undefined')
                    return;
                let prevented = false;
                const block = new $bog_wysiwyg_block();
                let image_src = '';
                block.on_image = (src) => {
                    if (src)
                        image_src = src;
                    return image_src || null;
                };
                const blob = new Blob([''], { type: 'image/png' });
                const file = new File([blob], 'test.png', { type: 'image/png' });
                const dt = new DataTransfer();
                dt.items.add(file);
                const event = new ClipboardEvent('paste', { clipboardData: dt });
                Object.defineProperty(event, 'preventDefault', { value: () => { prevented = true; } });
                const result = block.paste_event(event);
                $mol_assert_ok(result);
                $mol_assert_ok(prevented);
            },
            'paste_event takes over plain text too, so no editor junk lands in the DOM'() {
                if (typeof document === 'undefined')
                    return;
                const { block, node, calls, drop } = make_block('');
                try {
                    set_caret(node, 0);
                    const dt = new DataTransfer();
                    dt.items.add('hello', 'text/plain');
                    const event = new ClipboardEvent('paste', { clipboardData: dt });
                    let prevented = false;
                    Object.defineProperty(event, 'preventDefault', { value: () => { prevented = true; } });
                    const result = block.paste_event(event);
                    $mol_assert_ok(result);
                    $mol_assert_equal(prevented, true);
                    $mol_assert_equal(calls[0].name, 'on_paste_blocks');
                }
                finally {
                    drop();
                }
            },
            'drop_event without event returns null'() {
                const block = new $bog_wysiwyg_block();
                $mol_assert_equal(block.drop_event(), null);
            },
            'is_image returns true for image type'() {
                const block = new $bog_wysiwyg_block();
                block.type = () => 'image';
                $mol_assert_equal(block.is_image(), true);
            },
            'is_image returns false for paragraph type'() {
                const block = new $bog_wysiwyg_block();
                block.type = () => 'paragraph';
                $mol_assert_equal(block.is_image(), false);
            },
            // === parse_markdown ===
            'parse_markdown: single paragraph'() {
                const blocks = $bog_wysiwyg_parse_markdown('hello world');
                $mol_assert_equal(blocks.length, 1);
                $mol_assert_equal(blocks[0].type, 'paragraph');
                $mol_assert_equal(blocks[0].content, 'hello world');
            },
            'parse_markdown: two paragraphs separated by empty line'() {
                const blocks = $bog_wysiwyg_parse_markdown('first\n\nsecond');
                $mol_assert_equal(blocks.length, 2);
                $mol_assert_equal(blocks[0].content, 'first');
                $mol_assert_equal(blocks[1].content, 'second');
            },
            'parse_markdown: heading levels 1-3'() {
                const blocks = $bog_wysiwyg_parse_markdown('# H1\n\n## H2\n\n### H3');
                $mol_assert_equal(blocks.length, 3);
                $mol_assert_equal(blocks[0].type, 'heading');
                $mol_assert_equal(blocks[0].level, 1);
                $mol_assert_equal(blocks[0].content, 'H1');
                $mol_assert_equal(blocks[1].level, 2);
                $mol_assert_equal(blocks[2].level, 3);
            },
            'parse_markdown: code block'() {
                const blocks = $bog_wysiwyg_parse_markdown('```\nconst x = 1\nconst y = 2\n```');
                $mol_assert_equal(blocks.length, 1);
                $mol_assert_equal(blocks[0].type, 'code');
                $mol_assert_equal(blocks[0].content, 'const x = 1\nconst y = 2');
            },
            'parse_markdown: code block escapes HTML'() {
                const blocks = $bog_wysiwyg_parse_markdown('```\n<div>&</div>\n```');
                $mol_assert_equal(blocks[0].content, '&lt;div&gt;&amp;&lt;/div&gt;');
            },
            'parse_markdown: blockquote'() {
                const blocks = $bog_wysiwyg_parse_markdown('> line one\n> line two');
                $mol_assert_equal(blocks.length, 1);
                $mol_assert_equal(blocks[0].type, 'quote');
                $mol_assert_equal(blocks[0].content, 'line one<br>line two');
            },
            'parse_markdown: divider ---'() {
                const blocks = $bog_wysiwyg_parse_markdown('above\n\n---\n\nbelow');
                $mol_assert_equal(blocks.length, 3);
                $mol_assert_equal(blocks[1].type, 'divider');
                $mol_assert_equal(blocks[1].content, '');
            },
            'parse_markdown: divider ***'() {
                const blocks = $bog_wysiwyg_parse_markdown('***');
                $mol_assert_equal(blocks[0].type, 'divider');
            },
            'parse_markdown: inline bold'() {
                const blocks = $bog_wysiwyg_parse_markdown('hello **world**');
                $mol_assert_equal(blocks[0].content, 'hello <b>world</b>');
            },
            'parse_markdown: inline italic'() {
                const blocks = $bog_wysiwyg_parse_markdown('hello *world*');
                $mol_assert_equal(blocks[0].content, 'hello <i>world</i>');
            },
            'parse_markdown: inline code'() {
                const blocks = $bog_wysiwyg_parse_markdown('run `npm install`');
                $mol_assert_equal(blocks[0].content, 'run <code>npm install</code>');
            },
            'parse_markdown: inline strike'() {
                const blocks = $bog_wysiwyg_parse_markdown('hello ~~world~~');
                $mol_assert_equal(blocks[0].content, 'hello <s>world</s>');
            },
            'parse_markdown: inline link'() {
                const blocks = $bog_wysiwyg_parse_markdown('click [here](https://example.com)');
                $mol_assert_equal(blocks[0].content, 'click <a href="https://example.com">here</a>');
            },
            'parse_markdown: multi-line paragraph joins with br'() {
                const blocks = $bog_wysiwyg_parse_markdown('line one\nline two\nline three');
                $mol_assert_equal(blocks.length, 1);
                $mol_assert_equal(blocks[0].content, 'line one<br>line two<br>line three');
            },
            'parse_markdown: mixed content article'() {
                const md = '# Title\n\nSome text **bold**.\n\n```\ncode here\n```\n\n> quote\n\n---\n\nEnd.';
                const blocks = $bog_wysiwyg_parse_markdown(md);
                $mol_assert_equal(blocks.length, 6);
                $mol_assert_equal(blocks[0].type, 'heading');
                $mol_assert_equal(blocks[1].type, 'paragraph');
                $mol_assert_equal(blocks[2].type, 'code');
                $mol_assert_equal(blocks[3].type, 'quote');
                $mol_assert_equal(blocks[4].type, 'divider');
                $mol_assert_equal(blocks[5].type, 'paragraph');
            },
            'parse_markdown: empty input returns empty array'() {
                $mol_assert_equal($bog_wysiwyg_parse_markdown('').length, 0);
            },
            'parse_markdown: only empty lines returns empty array'() {
                $mol_assert_equal($bog_wysiwyg_parse_markdown('\n\n\n').length, 0);
            },
            'parse_markdown: unclosed code block collects to end'() {
                const blocks = $bog_wysiwyg_parse_markdown('```\ncode without closing');
                $mol_assert_equal(blocks.length, 1);
                $mol_assert_equal(blocks[0].type, 'code');
                $mol_assert_equal(blocks[0].content, 'code without closing');
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        const locale_en = {
            '$bog_wysiwyg_menu_command_paragraph': 'Text',
            '$bog_wysiwyg_menu_command_heading1': 'Heading 1',
            '$bog_wysiwyg_menu_command_heading2': 'Heading 2',
            '$bog_wysiwyg_menu_command_heading3': 'Heading 3',
            '$bog_wysiwyg_menu_command_code': 'Code',
            '$bog_wysiwyg_menu_command_quote': 'Quote',
            '$bog_wysiwyg_menu_command_list': 'List',
            '$bog_wysiwyg_menu_command_divider': 'Divider',
            '$bog_wysiwyg_menu_command_image': 'Image',
        };
        function menu_make() {
            $mol_locale.texts('en', locale_en);
            return new $bog_wysiwyg_menu();
        }
        $mol_test({
            'Menu commands returns builtin commands'() {
                const menu = menu_make();
                const cmds = menu.commands();
                $mol_assert_ok(cmds.length >= 9);
                $mol_assert_equal(cmds[0].id, 'paragraph');
                $mol_assert_equal(cmds[1].id, 'heading1');
                $mol_assert_equal(cmds[2].id, 'heading2');
                $mol_assert_equal(cmds[3].id, 'heading3');
                $mol_assert_equal(cmds[4].id, 'code');
                $mol_assert_equal(cmds[5].id, 'quote');
                $mol_assert_equal(cmds[6].id, 'list');
                $mol_assert_equal(cmds[7].id, 'divider');
                $mol_assert_equal(cmds[8].id, 'image');
            },
            'Menu option_rows returns views matching commands length'() {
                const menu = menu_make();
                const rows = menu.option_rows();
                $mol_assert_equal(rows.length, menu.commands().length);
            },
            'Menu option_title returns title for known command id'() {
                const menu = menu_make();
                const title = menu.option_title('paragraph');
                $mol_assert_ok(title.length > 0);
            },
            'Menu option_title returns empty string for unknown id'() {
                const menu = menu_make();
                const title = menu.option_title('nonexistent');
                $mol_assert_equal(title, '');
            },
            'Menu option_active returns true when index matches'() {
                const menu = menu_make();
                menu.index(0);
                const first_id = menu.commands()[0].id;
                $mol_assert_equal(menu.option_active(first_id), true);
            },
            'Menu option_active returns false for non-matching id'() {
                const menu = menu_make();
                menu.index(0);
                $mol_assert_equal(menu.option_active('nonexistent'), false);
            },
            'Menu option_active tracks index changes'() {
                const menu = menu_make();
                menu.index(2);
                const cmd = menu.commands()[2];
                $mol_assert_equal(menu.option_active(cmd.id), true);
                $mol_assert_equal(menu.option_active(menu.commands()[0].id), false);
            },
            'Menu option_click calls picked and hides menu'() {
                const menu = menu_make();
                menu.showed(true);
                let picked_val = '';
                menu.picked = (next) => {
                    if (next !== undefined)
                        picked_val = next;
                    return picked_val;
                };
                const event = { type: 'click' };
                menu.option_click('heading1', event);
                $mol_assert_equal(picked_val, 'heading1');
                $mol_assert_equal(menu.showed(), false);
            },
            'Menu option_click without event returns null'() {
                const menu = menu_make();
                $mol_assert_equal(menu.option_click('paragraph'), null);
            },
            'Menu pos_y_str returns pixel string'() {
                const menu = menu_make();
                menu.pos_y(200);
                $mol_assert_equal(menu.pos_y_str(), '200px');
            },
            'Menu pos_x_str returns pixel string'() {
                const menu = menu_make();
                menu.pos_x(350);
                $mol_assert_equal(menu.pos_x_str(), '350px');
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        '$mol_syntax2_md_flow'() {
            const check = (input, right) => {
                const tokens = [];
                $mol_syntax2_md_flow.tokenize(input, (...token) => tokens.push(token));
                $mol_assert_equal(tokens, right);
            };
            check('Hello,\nWorld..\r\n\r\n\nof Love!', [
                ['block', 'Hello,\n', ['Hello,', '\n'], 0],
                ['block', 'World..\r\n\r\n\n', ['World..', '\r\n\r\n\n'], 7],
                ['block', 'of Love!', ['of Love!', ''], 19],
            ]);
            check('# Header1\n\nHello!\n\n## Header2', [
                ['header', '# Header1\n\n', ['#', ' ', 'Header1', '\n\n'], 0],
                ['block', 'Hello!\n\n', ['Hello!', '\n\n'], 11],
                ['header', '## Header2', ['##', ' ', 'Header2', ''], 19],
            ]);
            check('```\nstart()\n```\n\n```jam.js\nrestart()\n```\n\nHello!\n\n```\nstop()\n```', [
                ['code', '```\nstart()\n```\n\n', ['```', '', 'start()\n', '```', '\n\n'], 0],
                ['code', '```jam.js\nrestart()\n```\n\n', ['```', 'jam.js', 'restart()\n', '```', '\n\n'], 17],
                ['block', 'Hello!\n\n', ['Hello!', '\n\n'], 42],
                ['code', '```\nstop()\n```', ['```', '', 'stop()\n', '```', ''], 50],
            ]);
            check('| header1 | header2\n|----|----\n| Cell11 | Cell12\n| Cell21 | Cell22\n\n| Cell11 | Cell12\n| Cell21 | Cell22\n', [
                ['table', '| header1 | header2\n|----|----\n| Cell11 | Cell12\n| Cell21 | Cell22\n\n', ['| header1 | header2\n|----|----\n| Cell11 | Cell12\n| Cell21 | Cell22\n', '\n'], 0],
                ['table', '| Cell11 | Cell12\n| Cell21 | Cell22\n', ['| Cell11 | Cell12\n| Cell21 | Cell22\n', ''], 68],
            ]);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'null by default'() {
            const key = String(Math.random());
            $mol_assert_equal($mol_state_session.value(key), null);
        },
        'storing'() {
            const key = String(Math.random());
            $mol_state_session.value(key, '$mol_state_session_test');
            $mol_assert_equal($mol_state_session.value(key), '$mol_state_session_test');
            $mol_state_session.value(key, null);
            $mol_assert_equal($mol_state_session.value(key), null);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'is same number'() {
            const Nan = $mol_data_const(Number.NaN);
            Nan(Number.NaN);
        },
        'is equal object'() {
            const Tags = $mol_data_const({ tags: ['deep', 'equals'] });
            Tags({ tags: ['deep', 'equals'] });
        },
        'is different number'() {
            const Five = $mol_data_const(5);
            $mol_assert_fail(() => Five(6), '6 is not 5');
        },
        'is different object'() {
            const Tags = $mol_data_const({ tags: ['deep', 'equals'] });
            $mol_assert_fail(() => Tags({ tags: ['shallow', 'equals'] }), `{"tags":["shallow","equals"]} is not {"tags":["deep","equals"]}`);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Is null'() {
            $mol_data_nullable($mol_data_number)(null);
        },
        'Is not null'() {
            $mol_data_nullable($mol_data_number)(0);
        },
        'Is undefined'() {
            $mol_assert_fail(() => {
                const Type = $mol_data_nullable($mol_data_number);
                Type(undefined);
            }, 'undefined is not a number');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        const Players_dict = $giper_baza_dict_to($bog_blitz_player);
        $mol_test({
            async 'Quiz entity stores title and settings'($) {
                const land = $giper_baza_land.make({ $ });
                const quiz = land.Data($bog_blitz_quiz);
                quiz.Title(null).val('Test Quiz');
                quiz.Points_base(null).val(100);
                quiz.Time_multiplier(null).val(1.5);
                quiz.Time_answer(null).val(10);
                quiz.Time_read(null).val(5);
                $mol_assert_equal(quiz.Title().val(), 'Test Quiz');
                $mol_assert_equal(quiz.Points_base().val(), 100);
                $mol_assert_equal(quiz.Time_multiplier().val(), 1.5);
                $mol_assert_equal(quiz.Time_answer().val(), 10);
            },
            async 'Session stores game state and quiz link'($) {
                const session_land = $giper_baza_land.make({ $ });
                const quiz_land = $giper_baza_land.make({ $ });
                const session = session_land.Data($bog_blitz_session);
                session.Quiz_link(null).val(quiz_land.link().str);
                session.Game_state(null).val('reading');
                session.Current_question(null).val(0);
                session.Round_start(null).val(12345);
                $mol_assert_equal(session.Game_state().val(), 'reading');
                $mol_assert_equal(session.Current_question().val(), 0);
                $mol_assert_equal(session.Quiz_link().val(), quiz_land.link().str);
                $mol_assert_equal(session.Round_start().val(), 12345);
            },
            async 'Session fields filter separates session keys from player keys'($) {
                const land = $giper_baza_land.make({ $ });
                const session = land.Data($bog_blitz_session);
                session.Game_state(null).val('reading');
                session.Quiz_link(null).val('some_link');
                const dict = land.Data(Players_dict);
                dict.key('player_lord_1', null).Name(null).val('Alice');
                const all_keys = Array.from(dict.keys() ?? []).map(k => String(k));
                const player_keys = all_keys.filter(k => !$bog_blitz_session_fields.has(k));
                $mol_assert_equal(player_keys.includes('player_lord_1'), true);
                for (const key of player_keys) {
                    $mol_assert_equal($bog_blitz_session_fields.has(key), false);
                }
            },
            async 'Player entity has Answer_land field'($) {
                const land = $giper_baza_land.make({ $ });
                const dict = land.Data(Players_dict);
                const player = dict.key('lord_1', null);
                player.Name(null).val('Bob');
                player.Score(null).val(150);
                player.IsHost(null).val(false);
                player.Answer_land(null).val('answer_land_link');
                $mol_assert_equal(player.Name().val(), 'Bob');
                $mol_assert_equal(player.Score().val(), 150);
                $mol_assert_equal(player.IsHost().val(), false);
                $mol_assert_equal(player.Answer_land().val(), 'answer_land_link');
            },
            async 'Player answers entity stores answers and reactions'($) {
                const land = $giper_baza_land.make({ $ });
                const answers = land.Data($bog_blitz_player_answers);
                answers.Answer(null).val('1,3');
                answers.Answer_time(null).val(1000);
                answers.React_heart(null).val(5);
                answers.React_fire(null).val(3);
                answers.React_smile(null).val(0);
                $mol_assert_equal(answers.Answer().val(), '1,3');
                $mol_assert_equal(answers.Answer_time().val(), 1000);
                $mol_assert_equal(answers.React_heart().val(), 5);
                $mol_assert_equal(answers.React_fire().val(), 3);
                $mol_assert_equal(answers.React_smile().val(), 0);
            },
            async 'Answers key stores and parses correct answers JSON'($) {
                const land = $giper_baza_land.make({ $ });
                const key_entity = land.Data($bog_blitz_answers_key);
                const data = [
                    { type: 'choice', correct: '1,3' },
                    { type: 'text_input', correct: 'Paris, paris, Париж' },
                    { type: 'choice', correct: '0' },
                ];
                key_entity.Data(null).val(JSON.stringify(data));
                const parsed = JSON.parse(key_entity.Data().val());
                $mol_assert_equal(parsed.length, 3);
                $mol_assert_equal(parsed[0].type, 'choice');
                $mol_assert_equal(parsed[0].correct, '1,3');
                $mol_assert_equal(parsed[1].type, 'text_input');
                $mol_assert_equal(parsed[1].correct, 'Paris, paris, Париж');
                $mol_assert_equal(parsed[2].correct, '0');
            },
            async 'Score: correct fast answer scores more than correct slow answer'($) {
                const points_base = 100;
                const time_multiplier = 1.5;
                const answer_duration = 10;
                const fast_elapsed = 1;
                const slow_elapsed = 9;
                const fast_ratio = Math.max(0, 1 - fast_elapsed / answer_duration);
                const slow_ratio = Math.max(0, 1 - slow_elapsed / answer_duration);
                const fast_score = points_base * (1 + fast_ratio * time_multiplier);
                const slow_score = points_base * (1 + slow_ratio * time_multiplier);
                $mol_assert_equal(fast_score > slow_score, true);
                $mol_assert_equal(fast_score > points_base, true);
                $mol_assert_equal(slow_score > points_base, true);
            },
            async 'Score: wrong answer is negative'($) {
                const points_base = 100;
                const time_multiplier = 1.5;
                const answer_duration = 10;
                const elapsed = 5;
                const time_ratio = Math.max(0, 1 - elapsed / answer_duration);
                const base = points_base * (1 + time_ratio * time_multiplier);
                const correct_points = base;
                const wrong_points = -base;
                $mol_assert_equal(correct_points > 0, true);
                $mol_assert_equal(wrong_points < 0, true);
                $mol_assert_equal(correct_points, -wrong_points);
            },
            async 'Choice answer: order does not matter'($) {
                const correct = '0,2';
                const correct_set = new Set(correct.split(',').filter(Boolean));
                function check(answer) {
                    const answer_set = new Set(answer.split(',').filter(Boolean));
                    return correct_set.size === answer_set.size &&
                        [...correct_set].every(k => answer_set.has(k));
                }
                $mol_assert_equal(check('0,2'), true);
                $mol_assert_equal(check('2,0'), true);
                $mol_assert_equal(check('0'), false);
                $mol_assert_equal(check('0,1'), false);
                $mol_assert_equal(check('0,1,2'), false);
                $mol_assert_equal(check(''), false);
            },
            async 'Text answer: case insensitive with variants'($) {
                const correct_text = 'Paris, paris, Париж';
                const variants = correct_text.split(',').map(v => v.trim().toLowerCase());
                function check(answer) {
                    return variants.includes(answer.trim().toLowerCase());
                }
                $mol_assert_equal(check('Paris'), true);
                $mol_assert_equal(check('paris'), true);
                $mol_assert_equal(check('PARIS'), true);
                $mol_assert_equal(check('Париж'), true);
                $mol_assert_equal(check(' paris '), true);
                $mol_assert_equal(check('London'), false);
                $mol_assert_equal(check(''), false);
            },
            async 'Multi_correct flag from answer key'($) {
                const keys = [
                    { type: 'choice', correct: '1,3' },
                    { type: 'choice', correct: '0' },
                    { type: 'text_input', correct: 'Paris' },
                ];
                function is_multi(key) {
                    return key.type !== 'text_input' && key.correct.split(',').length >= 2;
                }
                $mol_assert_equal(is_multi(keys[0]), true);
                $mol_assert_equal(is_multi(keys[1]), false);
                $mol_assert_equal(is_multi(keys[2]), false);
            },
            async 'Game state transitions stored in session'($) {
                const land = $giper_baza_land.make({ $ });
                const session = land.Data($bog_blitz_session);
                session.Game_state(null).val('reading');
                session.Current_question(null).val(0);
                $mol_assert_equal(session.Game_state().val(), 'reading');
                session.Game_state(null).val('answering');
                session.Round_start(null).val(1000);
                $mol_assert_equal(session.Game_state().val(), 'answering');
                session.Game_state(null).val('reveal');
                $mol_assert_equal(session.Game_state().val(), 'reveal');
                session.Game_state(null).val('leaderboard');
                $mol_assert_equal(session.Game_state().val(), 'leaderboard');
                session.Current_question(null).val(1);
                session.Game_state(null).val('reading');
                $mol_assert_equal(session.Current_question().val(), 1);
                $mol_assert_equal(session.Game_state().val(), 'reading');
                session.Game_state(null).val('final');
                $mol_assert_equal(session.Game_state().val(), 'final');
            },
            async 'Pause stores timestamp, resume clears it'($) {
                const land = $giper_baza_land.make({ $ });
                const session = land.Data($bog_blitz_session);
                session.Round_start(null).val(1000);
                session.Paused_at(null).val(0);
                $mol_assert_equal(session.Paused_at().val(), 0);
                session.Paused_at(null).val(1500);
                $mol_assert_equal(session.Paused_at().val() > 0, true);
                // Resume: shift round_start and clear paused_at
                const pause_duration = 500;
                session.Round_start(null).val(1000 + pause_duration);
                session.Paused_at(null).val(0);
                $mol_assert_equal(session.Paused_at().val(), 0);
                $mol_assert_equal(session.Round_start().val(), 1500);
            },
            async 'Reveal_correct published to session'($) {
                const land = $giper_baza_land.make({ $ });
                const session = land.Data($bog_blitz_session);
                session.Reveal_correct(null).val('');
                $mol_assert_equal(session.Reveal_correct().val(), '');
                // Host publishes correct indices during reveal
                session.Reveal_correct(null).val('0,2');
                $mol_assert_equal(session.Reveal_correct().val(), '0,2');
                // Cleared on next question
                session.Reveal_correct(null).val('');
                $mol_assert_equal(session.Reveal_correct().val(), '');
            },
            async 'Home ref stores quizzes land link'($) {
                const land = $giper_baza_land.make({ $ });
                const ref = land.Data($bog_blitz_home_ref);
                $mol_assert_equal(ref.Quizzes_land()?.val() ?? null, null);
                ref.Quizzes_land(null).val('quizzes_land_link');
                $mol_assert_equal(ref.Quizzes_land().val(), 'quizzes_land_link');
            },
            async 'Multiple players in session land'($) {
                const land = $giper_baza_land.make({ $ });
                const dict = land.Data(Players_dict);
                const host = dict.key('host_lord', null);
                host.Name(null).val('Host');
                host.IsHost(null).val(true);
                const p1 = dict.key('player_1', null);
                p1.Name(null).val('Alice');
                p1.Score(null).val(200);
                const p2 = dict.key('player_2', null);
                p2.Name(null).val('Bob');
                p2.Score(null).val(150);
                const all_keys = Array.from(dict.keys() ?? []).map(k => String(k));
                $mol_assert_equal(all_keys.includes('host_lord'), true);
                $mol_assert_equal(all_keys.includes('player_1'), true);
                $mol_assert_equal(all_keys.includes('player_2'), true);
                // Read back via same refs
                $mol_assert_equal(host.IsHost().val(), true);
                $mol_assert_equal(p1.Name().val(), 'Alice');
                $mol_assert_equal(p1.Score().val(), 200);
                $mol_assert_equal(p2.Name().val(), 'Bob');
                $mol_assert_equal(p2.Score().val(), 150);
            },
            async 'Player name writable without profile dependency'($) {
                const land = $giper_baza_land.make({ $ });
                const dict = land.Data(Players_dict);
                // Simulate join: create player and write name immediately
                const player = dict.key('new_player', null);
                const join_name = 'TestUser';
                // Name must be writable directly — no profile/home land needed
                player.Name(null).val(join_name);
                $mol_assert_equal(player.Name().val(), 'TestUser');
                // Avatar file link also writable without external deps
                player.Answer_land(null).val('some_answer_land');
                $mol_assert_equal(player.Answer_land().val(), 'some_answer_land');
            },
            async 'Player answers live in separate land from session'($) {
                const session_land = $giper_baza_land.make({ $ });
                const answer_land = $giper_baza_land.make({ $ });
                // Player registered in session land
                const dict = session_land.Data(Players_dict);
                const player = dict.key('player_lord', null);
                player.Name(null).val('Alice');
                player.Answer_land(null).val(answer_land.link().str);
                // Answers written to player's own land
                const answers = answer_land.Data($bog_blitz_player_answers);
                answers.Answer(null).val('1,3');
                answers.Answer_time(null).val(5000);
                answers.React_fire(null).val(2);
                // Session land player has no answer data — it's in the separate land
                $mol_assert_equal(player.Name().val(), 'Alice');
                $mol_assert_equal(player.Answer_land().val(), answer_land.link().str);
                // Answers readable from the answer land
                $mol_assert_equal(answers.Answer().val(), '1,3');
                $mol_assert_equal(answers.React_fire().val(), 2);
            },
            async 'Multi_correct published to session, not read from encrypted land'($) {
                const session_land = $giper_baza_land.make({ $ });
                const key_land = $giper_baza_land.make({ $ });
                // Host writes answer keys to encrypted land
                const keys_data = [
                    { type: 'choice', correct: '0,2' },
                    { type: 'choice', correct: '1' },
                ];
                key_land.Data($bog_blitz_answers_key).Data(null).val(JSON.stringify(keys_data));
                const session = session_land.Data($bog_blitz_session);
                session.Answers_key_land(null).val(key_land.link().str);
                // Host publishes Multi_correct for question 0 (has 2 correct)
                const q0 = keys_data[0];
                const multi0 = q0.type !== 'text_input' && q0.correct.split(',').length >= 2;
                session.Multi_correct(null).val(multi0);
                $mol_assert_equal(session.Multi_correct().val(), true);
                // Host publishes Multi_correct for question 1 (single correct)
                const q1 = keys_data[1];
                const multi1 = q1.type !== 'text_input' && q1.correct.split(',').length >= 2;
                session.Multi_correct(null).val(multi1);
                $mol_assert_equal(session.Multi_correct().val(), false);
            },
            async 'Reveal correct published to session from encrypted key'($) {
                const session_land = $giper_baza_land.make({ $ });
                const key_land = $giper_baza_land.make({ $ });
                const keys_data = [
                    { type: 'choice', correct: '1,3' },
                    { type: 'text_input', correct: 'Paris, paris' },
                ];
                key_land.Data($bog_blitz_answers_key).Data(null).val(JSON.stringify(keys_data));
                const session = session_land.Data($bog_blitz_session);
                // During reveal, host reads from encrypted land and publishes to session
                const parsed = JSON.parse(key_land.Data($bog_blitz_answers_key).Data().val());
                // Question 0: choice
                session.Reveal_correct(null).val(parsed[0].correct);
                $mol_assert_equal(session.Reveal_correct().val(), '1,3');
                // Players can check their answer against revealed correct
                const my_answer = '1,3';
                const correct_set = new Set(session.Reveal_correct().val().split(','));
                const answer_set = new Set(my_answer.split(','));
                const is_correct = correct_set.size === answer_set.size &&
                    [...correct_set].every(k => answer_set.has(k));
                $mol_assert_equal(is_correct, true);
                // Question 1: text
                session.Reveal_correct(null).val(parsed[1].correct);
                $mol_assert_equal(session.Reveal_correct().val(), 'Paris, paris');
            },
            async 'Score written by host to session land player'($) {
                const session_land = $giper_baza_land.make({ $ });
                const answer_land = $giper_baza_land.make({ $ });
                const dict = session_land.Data(Players_dict);
                const player = dict.key('player_1', null);
                player.Name(null).val('Alice');
                player.Score(null).val(0);
                player.Answer_land(null).val(answer_land.link().str);
                // Player writes answer to own land
                const answers = answer_land.Data($bog_blitz_player_answers);
                answers.Answer(null).val('0,2');
                answers.Answer_time(null).val(3000);
                // Host reads answer from player's land and calculates score
                const answer = answers.Answer().val();
                const correct = '0,2';
                const correct_set = new Set(correct.split(','));
                const answer_set = new Set(answer.split(','));
                const is_correct = correct_set.size === answer_set.size &&
                    [...correct_set].every(k => answer_set.has(k));
                const points = is_correct ? 175 : -175;
                const prev_score = player.Score().val();
                player.Score(null).val(prev_score + points);
                // Score written to session land, readable by everyone
                $mol_assert_equal(player.Score().val(), 175);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        $mol_test({
            'comment panel toggles open and closed'() {
                const comment = new $bog_wysiwyg_comment();
                $mol_assert_equal(comment.panel_open(), false);
                const event = new Event('click');
                comment.toggle(event);
                $mol_assert_equal(comment.panel_open(), true);
                comment.toggle(event);
                $mol_assert_equal(comment.panel_open(), false);
            },
            'close button closes panel'() {
                const comment = new $bog_wysiwyg_comment();
                comment.panel_open(true);
                $mol_assert_equal(comment.panel_open(), true);
                const event = new Event('click');
                comment.close(event);
                $mol_assert_equal(comment.panel_open(), false);
            },
            'toggle without event returns null'() {
                const comment = new $bog_wysiwyg_comment();
                $mol_assert_equal(comment.toggle(), null);
            },
            'close without event returns null'() {
                const comment = new $bog_wysiwyg_comment();
                $mol_assert_equal(comment.close(), null);
            },
            'comment count text is empty when no comments'() {
                const comment = new $bog_wysiwyg_comment();
                // Thread has no comment_land_link, so comment_count is 0
                $mol_assert_equal(comment.comment_count_text(), '');
            },
            'thread draft stores text'() {
                const thread = new $bog_wysiwyg_comment_thread();
                $mol_assert_equal(thread.draft(), '');
                thread.draft('hello');
                $mol_assert_equal(thread.draft(), 'hello');
            },
            'thread comment_count is 0 without baza'() {
                const thread = new $bog_wysiwyg_comment_thread();
                $mol_assert_equal(thread.comment_count(), 0);
            },
            'block_comment_open defaults to false'() {
                const editor = new $bog_wysiwyg();
                $mol_assert_equal(editor.block_comment_open('b1'), false);
            },
            'block_comment_open can be toggled'() {
                const editor = new $bog_wysiwyg();
                editor.block_comment_open('b1', true);
                $mol_assert_equal(editor.block_comment_open('b1'), true);
                editor.block_comment_open('b1', false);
                $mol_assert_equal(editor.block_comment_open('b1'), false);
            },
            'block_comment_land_link returns empty without baza'() {
                const editor = new $bog_wysiwyg();
                $mol_assert_equal(editor.block_comment_land_link('b1'), '');
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        $mol_test({
            'backlink_pages finds pages that reference target'() {
                const links = new $bog_wysiwyg_links();
                links.page_id = () => 'page_abc';
                links.all_pages = () => [
                    { id: 'page_1', title: 'First', blocks_html: ['see [[page_abc]] for details'] },
                    { id: 'page_2', title: 'Second', blocks_html: ['no links here'] },
                    { id: 'page_3', title: 'Third', blocks_html: ['also [[page_abc]]'] },
                ];
                const result = links.backlink_pages();
                $mol_assert_equal(result.length, 2);
                $mol_assert_equal(result[0].id, 'page_1');
                $mol_assert_equal(result[1].id, 'page_3');
            },
            'backlink_pages excludes self-reference'() {
                const links = new $bog_wysiwyg_links();
                links.page_id = () => 'page_abc';
                links.all_pages = () => [
                    { id: 'page_abc', title: 'Self', blocks_html: ['ref [[page_abc]]'] },
                    { id: 'page_2', title: 'Other', blocks_html: ['link to [[page_abc]]'] },
                ];
                const result = links.backlink_pages();
                $mol_assert_equal(result.length, 1);
                $mol_assert_equal(result[0].id, 'page_2');
            },
            'backlink_pages returns empty when no references'() {
                const links = new $bog_wysiwyg_links();
                links.page_id = () => 'page_abc';
                links.all_pages = () => [
                    { id: 'page_1', title: 'First', blocks_html: ['nothing here'] },
                ];
                const result = links.backlink_pages();
                $mol_assert_equal(result.length, 0);
            },
            'backlink_pages returns empty when page_id is empty'() {
                const links = new $bog_wysiwyg_links();
                links.page_id = () => '';
                links.all_pages = () => [
                    { id: 'page_1', title: 'First', blocks_html: ['[[page_abc]]'] },
                ];
                const result = links.backlink_pages();
                $mol_assert_equal(result.length, 0);
            },
            'link_title returns page title'() {
                const links = new $bog_wysiwyg_links();
                links.page_id = () => 'target';
                links.all_pages = () => [
                    { id: 'page_1', title: 'My Page', blocks_html: ['[[target]]'] },
                ];
                $mol_assert_equal(links.link_title('page_1'), 'My Page');
            },
            'link_title falls back to id when not found'() {
                const links = new $bog_wysiwyg_links();
                links.page_id = () => 'target';
                links.all_pages = () => [];
                $mol_assert_equal(links.link_title('unknown'), 'unknown');
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        $mol_test({
            'AI commands returns array of commands'() {
                const ai = new $bog_wysiwyg_ai();
                const cmds = ai.commands();
                $mol_assert_ok(cmds.length >= 4);
                $mol_assert_equal(cmds[0].id, 'continue');
                $mol_assert_ok(cmds[0].prompt.length > 0);
                $mol_assert_ok(cmds[0].title.length > 0);
            },
            'AI option_rows returns buttons for each command'() {
                const ai = new $bog_wysiwyg_ai();
                ai.loading(false);
                const rows = ai.option_rows();
                $mol_assert_equal(rows.length, ai.commands().length);
            },
            'AI option_rows shows loading when loading is true'() {
                const ai = new $bog_wysiwyg_ai();
                ai.loading(true);
                const rows = ai.option_rows();
                $mol_assert_equal(rows.length, 1);
            },
            'AI option_active returns true for current index'() {
                const ai = new $bog_wysiwyg_ai();
                ai.index(0);
                const first_id = ai.commands()[0].id;
                $mol_assert_equal(ai.option_active(first_id), true);
                $mol_assert_equal(ai.option_active('nonexistent'), false);
            },
            'AI option_active tracks index changes'() {
                const ai = new $bog_wysiwyg_ai();
                ai.index(2);
                const cmd = ai.commands()[2];
                $mol_assert_equal(ai.option_active(cmd.id), true);
                $mol_assert_equal(ai.option_active(ai.commands()[0].id), false);
            },
            'AI option_click without event returns null'() {
                const ai = new $bog_wysiwyg_ai();
                $mol_assert_equal(ai.option_click('continue'), null);
            },
            'AI pos_y_str returns pixel string'() {
                const ai = new $bog_wysiwyg_ai();
                ai.pos_y(123);
                $mol_assert_equal(ai.pos_y_str(), '123px');
            },
            'AI pos_x_str returns pixel string'() {
                const ai = new $bog_wysiwyg_ai();
                ai.pos_x(456);
                $mol_assert_equal(ai.pos_x_str(), '456px');
            },
            // === AI integration in wysiwyg ===
            'block_ai opens AI menu and sets context'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1']);
                editor.ai_showed(false);
                const fake_rect = { bottom: 100, left: 50, top: 0 };
                editor.Block = (id) => {
                    const block = new $bog_wysiwyg_block();
                    block.dom_node = () => {
                        const el = { getBoundingClientRect: () => fake_rect, textContent: 'hello world' };
                        return el;
                    };
                    return block;
                };
                editor.dom_node = () => ({ getBoundingClientRect: () => ({ top: 0, left: 0 }) });
                const event = new KeyboardEvent('keydown', { key: 'j', ctrlKey: true });
                editor.block_ai('b1', event);
                $mol_assert_equal(editor.ai_showed(), true);
                $mol_assert_equal(editor.ai_context(), 'hello world');
                $mol_assert_equal(editor.ai_index(), 0);
                $mol_assert_equal(editor.active_block_id(), 'b1');
            },
            'block_ai without event returns null'() {
                const editor = new $bog_wysiwyg();
                $mol_assert_equal(editor.block_ai('b1'), null);
            },
            'block_ai_key Escape closes AI menu'() {
                const editor = new $bog_wysiwyg();
                editor.ai_showed(true);
                const event = new KeyboardEvent('keydown', { key: 'Escape' });
                editor.block_ai_key('test', event);
                $mol_assert_equal(editor.ai_showed(), false);
            },
            'block_ai_key ArrowDown increments ai_index'() {
                const editor = new $bog_wysiwyg();
                editor.ai_index(0);
                const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
                editor.block_ai_key('test', event);
                $mol_assert_equal(editor.ai_index(), 1);
            },
            'block_ai_key ArrowUp decrements ai_index'() {
                const editor = new $bog_wysiwyg();
                editor.ai_index(2);
                const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                editor.block_ai_key('test', event);
                $mol_assert_equal(editor.ai_index(), 1);
            },
            'block_ai_key ArrowUp does not go below zero'() {
                const editor = new $bog_wysiwyg();
                editor.ai_index(0);
                const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                editor.block_ai_key('test', event);
                $mol_assert_equal(editor.ai_index(), 0);
            },
            'block_ai_key Enter triggers ai_picked and run_command'() {
                const editor = new $bog_wysiwyg();
                editor.ai_index(1);
                let picked_val = '';
                editor.ai_picked = (next) => {
                    if (next !== undefined)
                        picked_val = next;
                    return picked_val;
                };
                let run_id = '';
                const ai = editor.Ai();
                ai.run_command = (id) => { run_id = id; };
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                editor.block_ai_key('test', event);
                const expected_id = ai.commands()[1].id;
                $mol_assert_equal(picked_val, expected_id);
                $mol_assert_equal(run_id, expected_id);
            },
            'block_ai_key without event returns null'() {
                const editor = new $bog_wysiwyg();
                $mol_assert_equal(editor.block_ai_key('test'), null);
            },
            'ai_result with continue appends text'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.block_html('b1', 'Hello');
                editor.ai_picked('continue');
                editor.focus_block = () => { };
                editor.ai_result('world');
                $mol_assert_equal(editor.block_html('b1'), 'Hello world');
            },
            'ai_result with rewrite replaces text'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.block_html('b1', 'Old text');
                editor.ai_picked('rewrite');
                editor.focus_block = () => { };
                editor.ai_result('New text');
                $mol_assert_equal(editor.block_html('b1'), 'New text');
            },
            'ai_result without text returns null'() {
                const editor = new $bog_wysiwyg();
                $mol_assert_equal(editor.ai_result(), null);
            },
            'ai_result without active block still returns text'() {
                const editor = new $bog_wysiwyg();
                editor.focus_block = () => { };
                const result = editor.ai_result('some text');
                $mol_assert_equal(result, 'some text');
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        $mol_test({
            'page_land returns null when page_land_link is empty'() {
                const history = new $bog_wysiwyg_history();
                history.page_land_link = () => '';
                $mol_assert_equal(history.page_land(), null);
            },
            'page_data returns null when page_land is null'() {
                const history = new $bog_wysiwyg_history();
                history.page_land_link = () => '';
                $mol_assert_equal(history.page_data(), null);
            },
            'version_links returns empty array when no baza'() {
                const history = new $bog_wysiwyg_history();
                history.page_land_link = () => '';
                $mol_assert_like(history.version_links(), []);
            },
            'version_rows returns empty array when no baza'() {
                const history = new $bog_wysiwyg_history();
                history.page_land_link = () => '';
                $mol_assert_like(history.version_rows(), []);
            },
            'version_active always returns false'() {
                const history = new $bog_wysiwyg_history();
                $mol_assert_equal(history.version_active('some_link'), false);
                $mol_assert_equal(history.version_active(''), false);
            },
            'save_version without event returns null'() {
                const history = new $bog_wysiwyg_history();
                $mol_assert_equal(history.save_version(), null);
            },
            'version_click without event returns null'() {
                const history = new $bog_wysiwyg_history();
                $mol_assert_equal(history.version_click('some_link'), null);
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        /** Editor with real DOM behind every block and no Giper Baza at all */
        function make_editor(blocks) {
            const doc = $mol_dom_context.document;
            const root = doc.createElement('div');
            doc.body.appendChild(root);
            const editor = new $bog_wysiwyg();
            const views = new Map();
            const focused = [];
            editor.Block = (id) => {
                let view = views.get(id);
                if (view)
                    return view;
                view = new $bog_wysiwyg_block();
                const node = doc.createElement('div');
                node.contentEditable = 'true';
                node.tabIndex = 0;
                node.innerHTML = editor.block_html(id);
                root.appendChild(node);
                view.dom_node = () => node;
                view.html = (next) => editor.block_html(id, next);
                view.type = (next) => editor.block_type(id, next);
                view.level = (next) => editor.block_level(id, next);
                // The same wiring view.tree does for the keyed Block
                view.on_paste_blocks = (val) => editor.block_paste_blocks(id, val);
                view.on_split = (parts) => editor.block_split(id, parts);
                view.on_merge_prev = (event) => editor.block_merge_prev(id, event);
                view.on_merge_next = (event) => editor.block_merge_next(id, event);
                view.on_nav = (nav) => editor.block_nav(id, nav);
                views.set(id, view);
                return view;
            };
            editor.focus_block = (id, offset) => { focused.push({ id, offset }); };
            editor.block_ids(blocks.map(block => block.id));
            for (const block of blocks) {
                if (block.html !== undefined)
                    editor.block_html(block.id, block.html);
                if (block.type)
                    editor.block_type(block.id, block.type);
                if (block.level)
                    editor.block_level(block.id, block.level);
            }
            // Materialize the DOM so selections can reach into the blocks
            for (const block of blocks)
                editor.Block(block.id);
            return {
                editor,
                focused,
                node: (id) => editor.Block(id).dom_node(),
                drop: () => root.remove(),
            };
        }
        function select_across(from, from_offset, to, to_offset) {
            const doc = $mol_dom_context.document;
            const start = $bog_wysiwyg_point_at(from, from_offset);
            const end = $bog_wysiwyg_point_at(to, to_offset);
            const range = doc.createRange();
            range.setStart(start.node, start.offset);
            range.setEnd(end.node, end.offset);
            const sel = doc.defaultView.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        function editor_key(name, mods = {}) {
            return new KeyboardEvent('keydown', { key: name, cancelable: true, ...mods });
        }
        $mol_test({
            // === Splitting ===
            'block_split moves the tail into a new block'() {
                const { editor, focused, drop } = make_editor([
                    { id: 'a', html: 'hello world' },
                    { id: 'b', html: 'next' },
                ]);
                try {
                    editor.block_split('a', { head: 'hello', tail: ' world' });
                    const ids = editor.block_ids();
                    $mol_assert_equal(ids.length, 3);
                    $mol_assert_equal(ids[0], 'a');
                    $mol_assert_equal(ids[2], 'b');
                    $mol_assert_equal(editor.block_html('a'), 'hello');
                    $mol_assert_equal(editor.block_html(ids[1]), ' world');
                    $mol_assert_equal(focused.at(-1), { id: ids[1], offset: 0 });
                }
                finally {
                    drop();
                }
            },
            'block_split keeps the type and level of the source block'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'Title text', type: 'heading', level: 2 },
                ]);
                try {
                    editor.block_split('a', { head: 'Title', tail: ' text' });
                    const tail_id = editor.block_ids()[1];
                    $mol_assert_equal(editor.block_type(tail_id), 'heading');
                    $mol_assert_equal(editor.block_level(tail_id), 2);
                }
                finally {
                    drop();
                }
            },
            'block_split without parts does nothing'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'text' }]);
                try {
                    $mol_assert_equal(editor.block_split('a'), null);
                    $mol_assert_equal(editor.block_ids().length, 1);
                }
                finally {
                    drop();
                }
            },
            'block_split is refused in readonly mode'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'text' }]);
                try {
                    editor.readonly = () => true;
                    $mol_assert_equal(editor.block_split('a', { head: 'te', tail: 'xt' }), null);
                    $mol_assert_equal(editor.block_ids().length, 1);
                }
                finally {
                    drop();
                }
            },
            // === Merging ===
            'block_merge_prev glues the block into the previous one'() {
                const { editor, focused, drop } = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    editor.block_merge_prev('b', new Event('keydown'));
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'onetwo');
                    $mol_assert_equal(focused.at(-1), { id: 'a', offset: 3 });
                }
                finally {
                    drop();
                }
            },
            'block_merge_prev counts the joint offset over markup'() {
                const { editor, focused, drop } = make_editor([
                    { id: 'a', html: '<b>one</b>' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    editor.block_merge_prev('b', new Event('keydown'));
                    $mol_assert_equal(editor.block_html('a'), '<b>one</b>two');
                    $mol_assert_equal(focused.at(-1), { id: 'a', offset: 3 });
                }
                finally {
                    drop();
                }
            },
            'block_merge_prev on the first block changes nothing'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    editor.block_merge_prev('a', new Event('keydown'));
                    $mol_assert_equal(editor.block_ids(), ['a', 'b']);
                    $mol_assert_equal(editor.block_html('a'), 'one');
                }
                finally {
                    drop();
                }
            },
            'block_merge_prev drops a previous block that holds no text'() {
                const { editor, focused, drop } = make_editor([
                    { id: 'a', html: '<img src="x.png">', type: 'image' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    editor.block_merge_prev('b', new Event('keydown'));
                    $mol_assert_equal(editor.block_ids(), ['b']);
                    $mol_assert_equal(editor.block_html('b'), 'two');
                    $mol_assert_equal(focused.at(-1), { id: 'b', offset: 0 });
                }
                finally {
                    drop();
                }
            },
            'block_merge_next pulls the next block in'() {
                const { editor, focused, drop } = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    editor.block_merge_next('a', new Event('keydown'));
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'onetwo');
                    $mol_assert_equal(focused.at(-1), { id: 'a', offset: 3 });
                }
                finally {
                    drop();
                }
            },
            'block_merge_next on the last block changes nothing'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    editor.block_merge_next('b', new Event('keydown'));
                    $mol_assert_equal(editor.block_ids(), ['a', 'b']);
                }
                finally {
                    drop();
                }
            },
            'block_merge_next drops a next block that holds no text'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: '', type: 'divider' },
                ]);
                try {
                    editor.block_merge_next('a', new Event('keydown'));
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'one');
                }
                finally {
                    drop();
                }
            },
            'merges are refused in readonly mode'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    editor.readonly = () => true;
                    $mol_assert_equal(editor.block_merge_prev('b', new Event('keydown')), null);
                    $mol_assert_equal(editor.block_merge_next('a', new Event('keydown')), null);
                    $mol_assert_equal(editor.block_ids().length, 2);
                }
                finally {
                    drop();
                }
            },
            // === Vertical navigation ===
            'block_nav moves the caret into the next block'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'hello' },
                    { id: 'b', html: 'world wide' },
                ]);
                try {
                    editor.block_nav('a', { dir: 'down', x: 0, offset: 3 });
                    $mol_assert_equal(editor.block_view('b').caret_offset(), 3);
                }
                finally {
                    drop();
                }
            },
            'block_nav keeps the desired column across several steps'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'first line' },
                    { id: 'b', html: 'ab' },
                    { id: 'c', html: 'third line' },
                ]);
                try {
                    // Down through a short block: the caret clamps to its end
                    editor.block_nav('a', { dir: 'down', x: 0, offset: 7 });
                    $mol_assert_equal(editor.block_view('b').caret_offset(), 2);
                    // but the wanted column is remembered and restored in the next block
                    editor.block_nav('b', { dir: 'down', x: 0, offset: 2 });
                    $mol_assert_equal(editor.block_view('c').caret_offset(), 7);
                }
                finally {
                    drop();
                }
            },
            'the desired column is dropped by any other key'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'first line' },
                    { id: 'b', html: 'ab' },
                    { id: 'c', html: 'third line' },
                ]);
                try {
                    editor.block_nav('a', { dir: 'down', x: 0, offset: 7 });
                    editor.editor_keydown(editor_key('x'));
                    $mol_assert_equal(editor.nav_column, null);
                    editor.block_nav('b', { dir: 'down', x: 0, offset: 2 });
                    $mol_assert_equal(editor.block_view('c').caret_offset(), 2);
                }
                finally {
                    drop();
                }
            },
            'block_nav at the top edge stays put'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'hello' },
                    { id: 'b', html: 'world' },
                ]);
                try {
                    editor.block_view('a').focus_at(2);
                    editor.block_nav('a', { dir: 'up', x: 0, offset: 2 });
                    $mol_assert_equal(editor.block_view('a').caret_offset(), 2);
                }
                finally {
                    drop();
                }
            },
            'block_nav without a hint returns null'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'hello' }]);
                try {
                    $mol_assert_equal(editor.block_nav('a'), null);
                }
                finally {
                    drop();
                }
            },
            // === Undo / redo ===
            'undo and redo walk over typed text'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    editor.block_html('a', 'one two');
                    editor.history_record();
                    $mol_assert_equal(editor.history_states.length, 2);
                    $mol_assert_equal(editor.history_undo(), true);
                    $mol_assert_equal(editor.block_html('a'), 'one');
                    $mol_assert_equal(editor.history_redo(), true);
                    $mol_assert_equal(editor.block_html('a'), 'one two');
                }
                finally {
                    drop();
                }
            },
            'undo restores a block split'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'hello world' }]);
                try {
                    editor.block_split('a', { head: 'hello', tail: ' world' });
                    $mol_assert_equal(editor.block_ids().length, 2);
                    editor.history_undo();
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'hello world');
                }
                finally {
                    drop();
                }
            },
            'undo restores a merge'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    editor.block_merge_prev('b', new Event('keydown'));
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    editor.history_undo();
                    $mol_assert_equal(editor.block_ids(), ['a', 'b']);
                    $mol_assert_equal(editor.block_html('a'), 'one');
                    $mol_assert_equal(editor.block_html('b'), 'two');
                }
                finally {
                    drop();
                }
            },
            'undo restores the block type'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'text' }]);
                try {
                    editor.history_ensure();
                    editor.block_type('a', 'quote');
                    editor.history_record();
                    editor.history_undo();
                    $mol_assert_equal(editor.block_type('a'), 'paragraph');
                }
                finally {
                    drop();
                }
            },
            'undo at the bottom of the stack reports failure'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    $mol_assert_equal(editor.history_undo(), false);
                }
                finally {
                    drop();
                }
            },
            'redo at the top of the stack reports failure'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    $mol_assert_equal(editor.history_redo(), false);
                }
                finally {
                    drop();
                }
            },
            'a repeated state is not stacked twice'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_record();
                    editor.history_record();
                    editor.history_record();
                    $mol_assert_equal(editor.history_states.length, 1);
                }
                finally {
                    drop();
                }
            },
            'a new edit after undo cuts the redo tail'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    editor.block_html('a', 'two');
                    editor.history_record();
                    editor.history_undo();
                    editor.block_html('a', 'three');
                    editor.history_record();
                    $mol_assert_equal(editor.history_states.length, 2);
                    $mol_assert_equal(editor.history_redo(), false);
                }
                finally {
                    drop();
                }
            },
            'redo does not throw away text typed after an undo'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    editor.block_html('a', 'one two');
                    editor.history_record();
                    editor.history_undo();
                    // typed, but the debounce has not fired yet
                    editor.block_html('a', 'one three');
                    $mol_assert_equal(editor.history_redo(), false);
                    $mol_assert_equal(editor.block_html('a'), 'one three');
                }
                finally {
                    drop();
                }
            },
            'the stack is trimmed to its limit'() {
                const { editor, drop } = make_editor([{ id: 'a', html: '0' }]);
                try {
                    editor.history_limit = () => 3;
                    for (let i = 1; i <= 6; i++) {
                        editor.block_html('a', String(i));
                        editor.history_record();
                    }
                    $mol_assert_equal(editor.history_states.length, 3);
                    $mol_assert_equal(editor.history_states[0].blocks[0].content, '4');
                }
                finally {
                    drop();
                }
            },
            'a snapshot carries id, type, level, content and the caret'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: 'Head', type: 'heading', level: 3 },
                ]);
                try {
                    editor.block_view('a').focus_at(2);
                    const snapshot = editor.history_snapshot();
                    $mol_assert_equal(snapshot.blocks, [
                        { id: 'a', type: 'heading', level: 3, content: 'Head' },
                    ]);
                    $mol_assert_equal(snapshot.caret, { id: 'a', offset: 2 });
                }
                finally {
                    drop();
                }
            },
            'history stays in memory and never reaches Giper Baza'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    editor.block_html('a', 'two');
                    editor.history_record();
                    $mol_assert_equal(editor.has_baza(), false);
                    $mol_assert_equal(editor.history_states.length, 2);
                }
                finally {
                    drop();
                }
            },
            'the debounce timer is dropped when a snapshot is taken'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.block_input('a', new Event('input'));
                    $mol_assert_ok(editor.history_timer);
                    editor.history_record();
                    $mol_assert_equal(editor.history_timer, null);
                }
                finally {
                    drop();
                }
            },
            'Ctrl+Z undoes and Ctrl+Shift+Z redoes'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    editor.block_html('a', 'one two');
                    editor.history_record();
                    editor.editor_keydown(editor_key('z', { ctrlKey: true }));
                    $mol_assert_equal(editor.block_html('a'), 'one');
                    editor.editor_keydown(editor_key('z', { ctrlKey: true, shiftKey: true }));
                    $mol_assert_equal(editor.block_html('a'), 'one two');
                }
                finally {
                    drop();
                }
            },
            'Ctrl+Y redoes as well'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    editor.block_html('a', 'one two');
                    editor.history_record();
                    editor.history_undo();
                    editor.editor_keydown(editor_key('y', { ctrlKey: true }));
                    $mol_assert_equal(editor.block_html('a'), 'one two');
                }
                finally {
                    drop();
                }
            },
            'undo is not offered in readonly mode'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'one' }]);
                try {
                    editor.history_ensure();
                    editor.block_html('a', 'one two');
                    editor.history_record();
                    editor.readonly = () => true;
                    const event = editor_key('z', { ctrlKey: true });
                    editor.editor_keydown(event);
                    $mol_assert_equal(event.defaultPrevented, false);
                    $mol_assert_equal(editor.block_html('a'), 'one two');
                }
                finally {
                    drop();
                }
            },
            // === Selection across blocks ===
            'block_of_node finds the owning block'() {
                const helper = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    const { editor } = helper;
                    $mol_assert_equal(editor.block_of_node(helper.node('b').firstChild), 'b');
                    $mol_assert_equal(editor.block_of_node(helper.node('a')), 'a');
                    $mol_assert_equal(editor.block_of_node(null), '');
                }
                finally {
                    helper.drop();
                }
            },
            'selection_spans_blocks is false inside a single block'() {
                const helper = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    select_across(helper.node('a'), 0, helper.node('a'), 2);
                    $mol_assert_equal(helper.editor.selection_spans_blocks(), false);
                }
                finally {
                    helper.drop();
                }
            },
            'selection_spans_blocks is true over a border'() {
                const helper = make_editor([
                    { id: 'a', html: 'one' },
                    { id: 'b', html: 'two' },
                ]);
                try {
                    select_across(helper.node('a'), 1, helper.node('b'), 1);
                    $mol_assert_equal(helper.editor.selection_spans_blocks(), true);
                }
                finally {
                    helper.drop();
                }
            },
            'delete_selection keeps the head of the first and the tail of the last block'() {
                const helper = make_editor([
                    { id: 'a', html: 'aaa' },
                    { id: 'b', html: 'bbb' },
                    { id: 'c', html: 'ccc' },
                ]);
                try {
                    const { editor, focused } = helper;
                    select_across(helper.node('a'), 1, helper.node('c'), 2);
                    $mol_assert_equal(editor.delete_selection(), true);
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'ac');
                    $mol_assert_equal(focused.at(-1), { id: 'a', offset: 1 });
                }
                finally {
                    helper.drop();
                }
            },
            'delete_selection keeps markup around the cut'() {
                const helper = make_editor([
                    { id: 'a', html: '<b>keep</b>drop' },
                    { id: 'b', html: 'drop<i>rest</i>' },
                ]);
                try {
                    select_across(helper.node('a'), 4, helper.node('b'), 4);
                    $mol_assert_equal(helper.editor.delete_selection(), true);
                    $mol_assert_equal(helper.editor.block_html('a'), '<b>keep</b><i>rest</i>');
                }
                finally {
                    helper.drop();
                }
            },
            'delete_selection can put a typed character in place of the selection'() {
                const helper = make_editor([
                    { id: 'a', html: 'aaa' },
                    { id: 'b', html: 'bbb' },
                ]);
                try {
                    const { editor, focused } = helper;
                    select_across(helper.node('a'), 1, helper.node('b'), 2);
                    $mol_assert_equal(editor.delete_selection('X'), true);
                    $mol_assert_equal(editor.block_html('a'), 'aXb');
                    $mol_assert_equal(focused.at(-1), { id: 'a', offset: 2 });
                }
                finally {
                    helper.drop();
                }
            },
            'delete_selection escapes the typed character'() {
                const helper = make_editor([
                    { id: 'a', html: 'aaa' },
                    { id: 'b', html: 'bbb' },
                ]);
                try {
                    select_across(helper.node('a'), 1, helper.node('b'), 2);
                    helper.editor.delete_selection('<');
                    $mol_assert_equal(helper.editor.block_html('a'), 'a&lt;b');
                }
                finally {
                    helper.drop();
                }
            },
            'delete_selection ignores a selection inside one block'() {
                const helper = make_editor([
                    { id: 'a', html: 'aaa' },
                    { id: 'b', html: 'bbb' },
                ]);
                try {
                    select_across(helper.node('a'), 0, helper.node('a'), 2);
                    $mol_assert_equal(helper.editor.delete_selection(), false);
                    $mol_assert_equal(helper.editor.block_ids().length, 2);
                }
                finally {
                    helper.drop();
                }
            },
            'Backspace over a cross block selection keeps the document sane'() {
                const helper = make_editor([
                    { id: 'a', html: 'aaa' },
                    { id: 'b', html: 'bbb' },
                    { id: 'c', html: 'ccc' },
                ]);
                try {
                    const { editor } = helper;
                    select_across(helper.node('a'), 1, helper.node('c'), 1);
                    const event = editor_key('Backspace');
                    editor.editor_keydown(event);
                    $mol_assert_equal(event.defaultPrevented, true);
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'acc');
                }
                finally {
                    helper.drop();
                }
            },
            'typing over a cross block selection replaces it with the character'() {
                const helper = make_editor([
                    { id: 'a', html: 'aaa' },
                    { id: 'b', html: 'bbb' },
                ]);
                try {
                    const { editor } = helper;
                    select_across(helper.node('a'), 2, helper.node('b'), 1);
                    const event = editor_key('q');
                    editor.editor_keydown(event);
                    $mol_assert_equal(event.defaultPrevented, true);
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'aaqbb');
                }
                finally {
                    helper.drop();
                }
            },
            'a cross block deletion can be undone'() {
                const helper = make_editor([
                    { id: 'a', html: 'aaa' },
                    { id: 'b', html: 'bbb' },
                    { id: 'c', html: 'ccc' },
                ]);
                try {
                    const { editor } = helper;
                    select_across(helper.node('a'), 1, helper.node('c'), 1);
                    editor.delete_selection();
                    editor.history_undo();
                    $mol_assert_equal(editor.block_ids(), ['a', 'b', 'c']);
                    $mol_assert_equal(editor.block_html('a'), 'aaa');
                    $mol_assert_equal(editor.block_html('c'), 'ccc');
                }
                finally {
                    helper.drop();
                }
            },
            'a printable key with a plain caret is left to the browser'() {
                const helper = make_editor([
                    { id: 'a', html: 'aaa' },
                    { id: 'b', html: 'bbb' },
                ]);
                try {
                    helper.editor.block_view('a').focus_at(1);
                    const event = editor_key('q');
                    helper.editor.editor_keydown(event);
                    $mol_assert_equal(event.defaultPrevented, false);
                    $mol_assert_equal(helper.editor.block_html('a'), 'aaa');
                }
                finally {
                    helper.drop();
                }
            },
            'ArrowDown increments menu_index within bounds'() {
                const editor = new $bog_wysiwyg();
                editor.menu_index(0);
                const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
                editor.block_menu_key('test', event);
                $mol_assert_equal(editor.menu_index(), 1);
            },
            'ArrowDown does not exceed max index'() {
                const editor = new $bog_wysiwyg();
                const max = editor.Menu().commands().length - 1;
                editor.menu_index(max);
                const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
                editor.block_menu_key('test', event);
                $mol_assert_equal(editor.menu_index(), max);
            },
            'ArrowUp decrements menu_index within bounds'() {
                const editor = new $bog_wysiwyg();
                editor.menu_index(3);
                const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                editor.block_menu_key('test', event);
                $mol_assert_equal(editor.menu_index(), 2);
            },
            'ArrowUp does not go below zero'() {
                const editor = new $bog_wysiwyg();
                editor.menu_index(0);
                const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                editor.block_menu_key('test', event);
                $mol_assert_equal(editor.menu_index(), 0);
            },
            'Enter triggers menu_picked'() {
                const editor = new $bog_wysiwyg();
                editor.menu_index(2);
                let picked_val = '';
                editor.menu_picked = (next) => {
                    if (next !== undefined)
                        picked_val = next;
                    return picked_val;
                };
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                editor.block_menu_key('test', event);
                const expected_id = editor.Menu().commands()[2].id;
                $mol_assert_equal(picked_val, expected_id);
            },
            'Escape closes menu'() {
                const editor = new $bog_wysiwyg();
                editor.menu_showed(true);
                const event = new KeyboardEvent('keydown', { key: 'Escape' });
                editor.block_menu_key('test', event);
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'Printable char closes menu'() {
                const editor = new $bog_wysiwyg();
                editor.menu_showed(true);
                const event = new KeyboardEvent('keydown', { key: 'a' });
                editor.block_menu_key('test', event);
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'option_active returns true for current index'() {
                const menu = new $bog_wysiwyg_menu();
                menu.index(0);
                const first_id = menu.commands()[0].id;
                $mol_assert_equal(menu.option_active(first_id), true);
                $mol_assert_equal(menu.option_active('nonexistent'), false);
            },
            'option_active tracks index changes'() {
                const menu = new $bog_wysiwyg_menu();
                menu.index(2);
                const cmd = menu.commands()[2];
                $mol_assert_equal(menu.option_active(cmd.id), true);
                $mol_assert_equal(menu.option_active(menu.commands()[0].id), false);
            },
            'option_click calls picked and closes menu'() {
                const menu = new $bog_wysiwyg_menu();
                menu.showed(true);
                let picked_val = '';
                menu.picked = (next) => {
                    if (next !== undefined)
                        picked_val = next;
                    return picked_val;
                };
                const event = new Event('click');
                menu.option_click('heading1', event);
                $mol_assert_equal(picked_val, 'heading1');
                $mol_assert_equal(menu.showed(), false);
            },
            'option_click without event returns null'() {
                const menu = new $bog_wysiwyg_menu();
                $mol_assert_equal(menu.option_click('heading1'), null);
            },
            'menu_picked applies heading type with level'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('heading2');
                $mol_assert_equal(editor.block_type('b1'), 'heading');
                $mol_assert_equal(editor.block_level('b1'), 2);
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'menu_picked applies non-heading type'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('code');
                $mol_assert_equal(editor.block_type('b1'), 'code');
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'block_slash opens menu and resets index'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1']);
                editor.menu_index(5);
                editor.menu_showed(false);
                // Mock DOM methods that block_slash uses
                const fake_rect = { bottom: 100, left: 50, top: 0 };
                editor.Block = (id) => {
                    const block = new $bog_wysiwyg_block();
                    block.dom_node = () => ({ getBoundingClientRect: () => fake_rect });
                    return block;
                };
                editor.dom_node = () => ({ getBoundingClientRect: () => ({ top: 0, left: 0 }) });
                const event = new KeyboardEvent('keydown', { key: '/' });
                editor.block_slash('b1', event);
                $mol_assert_equal(editor.menu_index(), 0);
                $mol_assert_equal(editor.menu_showed(), true);
            },
            // === Block management ===
            'block_enter creates new block after current'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b']);
                editor.focus_block = () => { };
                const event = new Event('test');
                editor.block_enter('a', event);
                const ids = editor.block_ids();
                $mol_assert_equal(ids.length, 3);
                $mol_assert_equal(ids[0], 'a');
                $mol_assert_equal(ids[2], 'b');
            },
            'block_enter preserves all existing blocks'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['x', 'y', 'z']);
                editor.focus_block = () => { };
                const event = new Event('test');
                editor.block_enter('y', event);
                const ids = editor.block_ids();
                $mol_assert_equal(ids.length, 4);
                $mol_assert_equal(ids[0], 'x');
                $mol_assert_equal(ids[1], 'y');
                // ids[2] — new generated id
                $mol_assert_equal(ids[3], 'z');
            },
            'block_enter without event returns null'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a']);
                $mol_assert_equal(editor.block_enter('a'), null);
                $mol_assert_equal(editor.block_ids().length, 1);
            },
            'block_enter on nonexistent id inserts at end'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b']);
                editor.focus_block = () => { };
                const event = new Event('test');
                editor.block_enter('nonexistent', event);
                const ids = editor.block_ids();
                // indexOf returns -1, splice(-1+1=0, 0, new_id) inserts at index 0
                $mol_assert_equal(ids.length, 3);
            },
            'block_remove removes block'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                editor.focus_block = () => { };
                const event = new Event('test');
                editor.block_remove('b', event);
                const ids = editor.block_ids();
                $mol_assert_equal(ids.length, 2);
                $mol_assert_equal(ids[0], 'a');
                $mol_assert_equal(ids[1], 'c');
            },
            'block_remove does not remove last block'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['only']);
                const event = new Event('test');
                const result = editor.block_remove('only', event);
                $mol_assert_equal(result, null);
                $mol_assert_equal(editor.block_ids().length, 1);
                $mol_assert_equal(editor.block_ids()[0], 'only');
            },
            'block_remove without event returns null'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b']);
                $mol_assert_equal(editor.block_remove('a'), null);
                $mol_assert_equal(editor.block_ids().length, 2);
            },
            // === Slash menu → block type integration ===
            'menu_picked with paragraph sets type paragraph'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('paragraph');
                $mol_assert_equal(editor.block_type('b1'), 'paragraph');
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'menu_picked with code sets type code'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('code');
                $mol_assert_equal(editor.block_type('b1'), 'code');
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'menu_picked with quote sets type quote'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('quote');
                $mol_assert_equal(editor.block_type('b1'), 'quote');
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'menu_picked with list sets type list'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('list');
                $mol_assert_equal(editor.block_type('b1'), 'list');
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'menu_picked with divider sets type divider'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('divider');
                $mol_assert_equal(editor.block_type('b1'), 'divider');
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'menu_picked with heading1 sets type heading and level 1'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('heading1');
                $mol_assert_equal(editor.block_type('b1'), 'heading');
                $mol_assert_equal(editor.block_level('b1'), 1);
                $mol_assert_equal(editor.menu_showed(), false);
            },
            'menu_picked with heading3 sets type heading and level 3'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('heading3');
                $mol_assert_equal(editor.block_type('b1'), 'heading');
                $mol_assert_equal(editor.block_level('b1'), 3);
                $mol_assert_equal(editor.menu_showed(), false);
            },
            // === Block properties ===
            'block_html stores and returns HTML'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1']);
                editor.block_html('b1', '<b>hello</b>');
                $mol_assert_equal(editor.block_html('b1'), '<b>hello</b>');
            },
            'block_type defaults to paragraph'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1']);
                $mol_assert_equal(editor.block_type('b1'), 'paragraph');
            },
            'block_level defaults to 1'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1']);
                $mol_assert_equal(editor.block_level('b1'), 1);
            },
            'each block has independent html/type/level'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1', 'b2']);
                editor.block_html('b1', 'first');
                editor.block_html('b2', 'second');
                editor.block_type('b1', 'code');
                editor.block_type('b2', 'quote');
                editor.block_level('b1', 2);
                editor.block_level('b2', 3);
                $mol_assert_equal(editor.block_html('b1'), 'first');
                $mol_assert_equal(editor.block_html('b2'), 'second');
                $mol_assert_equal(editor.block_type('b1'), 'code');
                $mol_assert_equal(editor.block_type('b2'), 'quote');
                $mol_assert_equal(editor.block_level('b1'), 2);
                $mol_assert_equal(editor.block_level('b2'), 3);
            },
            // === Edge cases ===
            'active_block_id defaults to empty string'() {
                const editor = new $bog_wysiwyg();
                $mol_assert_equal(editor.active_block_id(), '');
            },
            'generate_id returns non-empty strings'() {
                const editor = new $bog_wysiwyg();
                const id1 = editor.generate_id();
                const id2 = editor.generate_id();
                $mol_assert_ok(id1.length > 0);
                $mol_assert_ok(id2.length > 0);
            },
            'block_views returns array of blocks matching block_ids'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                const views = editor.block_views();
                $mol_assert_equal(views.length, 3);
            },
            'menu_picked clears block html'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.block_html('b1', 'some text');
                editor.menu_showed(true);
                editor.focus_block = () => { };
                editor.menu_picked('code');
                $mol_assert_equal(editor.block_html('b1'), '');
            },
            'menu_picked with no active_block_id does nothing'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1']);
                editor.block_type('b1', 'paragraph');
                editor.menu_showed(true);
                editor.focus_block = () => { };
                // active_block_id defaults to '', apply_menu_command returns early
                editor.menu_picked('code');
                $mol_assert_equal(editor.block_type('b1'), 'paragraph');
            },
            // === Focus behavior ===
            'block_remove calls focus_block with previous id'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                let focused_id = '';
                editor.focus_block = (id) => { focused_id = id; };
                const event = new Event('test');
                editor.block_remove('b', event);
                $mol_assert_equal(focused_id, 'a');
            },
            'block_remove of first block focuses new first block'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                let focused_id = '';
                editor.focus_block = (id) => { focused_id = id; };
                const event = new Event('test');
                editor.block_remove('a', event);
                // index was 0, Math.max(0, 0-1) = 0, focuses ids[0] which is now 'b'
                $mol_assert_equal(focused_id, 'b');
            },
            // === Block operations with menu open ===
            'block_enter while menu is open still creates block'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                const event = new Event('test');
                editor.block_enter('a', event);
                $mol_assert_equal(editor.block_ids().length, 3);
            },
            'block_remove while menu is open still removes block'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                const event = new Event('test');
                editor.block_remove('b', event);
                $mol_assert_equal(editor.block_ids().length, 2);
            },
            // === Multiple sequential operations ===
            'multiple block_enter calls create multiple blocks'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a']);
                editor.focus_block = () => { };
                const event = new Event('test');
                editor.block_enter('a', event);
                editor.block_enter('a', event);
                editor.block_enter('a', event);
                $mol_assert_equal(editor.block_ids().length, 4);
                $mol_assert_equal(editor.block_ids()[0], 'a');
            },
            'block_enter then block_remove restores original count'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b']);
                editor.focus_block = () => { };
                const event = new Event('test');
                editor.block_enter('a', event);
                const new_id = editor.block_ids()[1];
                editor.block_remove(new_id, event);
                $mol_assert_equal(editor.block_ids().length, 2);
                $mol_assert_equal(editor.block_ids()[0], 'a');
                $mol_assert_equal(editor.block_ids()[1], 'b');
            },
            'menu_picked with heading2 then menu_picked with code overwrites type'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.focus_block = () => { };
                editor.menu_showed(true);
                editor.menu_picked('heading2');
                $mol_assert_equal(editor.block_type('b1'), 'heading');
                $mol_assert_equal(editor.block_level('b1'), 2);
                editor.menu_showed(true);
                editor.menu_picked('code');
                $mol_assert_equal(editor.block_type('b1'), 'code');
            },
            // === Image block ===
            'image command exists in slash menu'() {
                const menu = new $bog_wysiwyg_menu();
                const cmds = menu.commands();
                const image_cmd = cmds.find(c => c.id === 'image');
                $mol_assert_ok(image_cmd);
            },
            'block_image sets type to image and stores img html'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1']);
                editor.block_image('b1', 'https://example.com/photo.jpg');
                $mol_assert_equal(editor.block_type('b1'), 'image');
                $mol_assert_ok(editor.block_html('b1').includes('<img'));
                $mol_assert_ok(editor.block_html('b1').includes('https://example.com/photo.jpg'));
            },
            'block_image without src returns null'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['b1']);
                $mol_assert_equal(editor.block_image('b1'), null);
                $mol_assert_equal(editor.block_type('b1'), 'paragraph');
            },
            'menu_picked with image prompts for URL'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                const ctx = editor.$.$mol_dom_context;
                const original_prompt = ctx.prompt;
                ctx.prompt = () => 'https://example.com/img.png';
                editor.menu_picked('image');
                $mol_assert_equal(editor.block_type('b1'), 'image');
                $mol_assert_ok(editor.block_html('b1').includes('https://example.com/img.png'));
                $mol_assert_equal(editor.menu_showed(), false);
                ctx.prompt = original_prompt;
            },
            'menu_picked with image cancelled prompt keeps paragraph'() {
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.menu_showed(true);
                editor.focus_block = () => { };
                const ctx = editor.$.$mol_dom_context;
                const original_prompt = ctx.prompt;
                ctx.prompt = () => null;
                editor.menu_picked('image');
                $mol_assert_equal(editor.block_type('b1'), 'paragraph');
                $mol_assert_equal(editor.menu_showed(), false);
                ctx.prompt = original_prompt;
            },
            // === Drag & Drop ===
            'move_block moves block down (after)'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                editor.move_block('a', 'c', 'after');
                const ids = editor.block_ids();
                $mol_assert_equal(ids[0], 'b');
                $mol_assert_equal(ids[1], 'c');
                $mol_assert_equal(ids[2], 'a');
            },
            'move_block moves block up (before)'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                editor.move_block('c', 'a', 'before');
                const ids = editor.block_ids();
                $mol_assert_equal(ids[0], 'c');
                $mol_assert_equal(ids[1], 'a');
                $mol_assert_equal(ids[2], 'b');
            },
            'move_block to same position does not change order'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                editor.move_block('b', 'a', 'after');
                const ids = editor.block_ids();
                $mol_assert_equal(ids[0], 'a');
                $mol_assert_equal(ids[1], 'b');
                $mol_assert_equal(ids[2], 'c');
            },
            'move_block with invalid from_id does nothing'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                editor.move_block('nonexistent', 'b', 'after');
                const ids = editor.block_ids();
                $mol_assert_equal(ids.length, 3);
                $mol_assert_equal(ids[0], 'a');
            },
            'drag_source_id stores and clears'() {
                const editor = new $bog_wysiwyg();
                $mol_assert_equal(editor.drag_source_id(), '');
                editor.drag_source_id('block1');
                $mol_assert_equal(editor.drag_source_id(), 'block1');
                editor.drag_source_id('');
                $mol_assert_equal(editor.drag_source_id(), '');
            },
            'drag_over_id stores and clears'() {
                const editor = new $bog_wysiwyg();
                $mol_assert_equal(editor.drag_over_id(), '');
                editor.drag_over_id('block2');
                $mol_assert_equal(editor.drag_over_id(), 'block2');
            },
            'clear_drag_state resets all drag state'() {
                const editor = new $bog_wysiwyg();
                editor.drag_source_id('src');
                editor.drag_over_id('over');
                editor.drag_over_position('before');
                editor.clear_drag_state();
                $mol_assert_equal(editor.drag_source_id(), '');
                $mol_assert_equal(editor.drag_over_id(), '');
                $mol_assert_equal(editor.drag_over_position(), 'after');
            },
            'row_is_drag_over returns true for target, false for source'() {
                const editor = new $bog_wysiwyg();
                editor.drag_source_id('a');
                editor.drag_over_id('b');
                $mol_assert_equal(editor.row_is_drag_over('b'), true);
                $mol_assert_equal(editor.row_is_drag_over('a'), false);
                $mol_assert_equal(editor.row_is_drag_over('c'), false);
            },
            'row_is_dragging returns true for source block'() {
                const editor = new $bog_wysiwyg();
                editor.drag_source_id('a');
                $mol_assert_equal(editor.row_is_dragging('a'), true);
                $mol_assert_equal(editor.row_is_dragging('b'), false);
            },
            'block_row_views returns rows matching block_ids'() {
                const editor = new $bog_wysiwyg();
                editor.block_ids(['a', 'b', 'c']);
                const rows = editor.block_row_views();
                $mol_assert_equal(rows.length, 3);
            },
            // === html_to_md ===
            'html_to_md: bold to markdown'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<b>hello</b>'), '**hello**');
            },
            'html_to_md: strong to markdown'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<strong>hello</strong>'), '**hello**');
            },
            'html_to_md: italic to markdown'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<i>hello</i>'), '*hello*');
            },
            'html_to_md: em to markdown'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<em>hello</em>'), '*hello*');
            },
            'html_to_md: code to markdown'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<code>x</code>'), '`x`');
            },
            'html_to_md: strike to markdown'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<s>old</s>'), '~~old~~');
            },
            'html_to_md: del to markdown'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<del>old</del>'), '~~old~~');
            },
            'html_to_md: link to markdown'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<a href="https://example.com">click</a>'), '[click](https://example.com)');
            },
            'html_to_md: br to newline'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('line1<br>line2'), 'line1\nline2');
            },
            'html_to_md: strips unknown tags'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('<div>hello</div>'), 'hello');
            },
            'html_to_md: decodes HTML entities'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('&amp; &lt; &gt; &quot;'), '& < > "');
            },
            'html_to_md: mixed inline formatting'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('hello <b>bold</b> and <i>italic</i>'), 'hello **bold** and *italic*');
            },
            'html_to_md: plain text unchanged'() {
                $mol_assert_equal($bog_wysiwyg_html_to_md('just text'), 'just text');
            },
            // === block_paste_blocks ===
            'block_paste_blocks fills an untouched block and adds the rest after it'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: '' },
                    { id: 'b', html: 'next' },
                ]);
                try {
                    editor.block_paste_blocks('a', { drafts: [
                            { type: 'heading', content: 'Title', level: 1 },
                            { type: 'paragraph', content: 'text' },
                            { type: 'code', content: 'x = 1' },
                        ] });
                    const ids = editor.block_ids();
                    $mol_assert_equal(ids.length, 4);
                    $mol_assert_equal(ids[0], 'a');
                    $mol_assert_equal(ids[3], 'b');
                    $mol_assert_equal(editor.block_type('a'), 'heading');
                    $mol_assert_equal(editor.block_html('a'), 'Title');
                    $mol_assert_equal(editor.block_level('a'), 1);
                    $mol_assert_equal(editor.block_type(ids[1]), 'paragraph');
                    $mol_assert_equal(editor.block_html(ids[1]), 'text');
                    $mol_assert_equal(editor.block_type(ids[2]), 'code');
                    $mol_assert_equal(editor.block_html(ids[2]), 'x = 1');
                }
                finally {
                    drop();
                }
            },
            'block_paste_blocks with a single draft keeps the block count'() {
                const { editor, drop } = make_editor([
                    { id: 'a', html: '' },
                    { id: 'b', html: 'next' },
                ]);
                try {
                    editor.block_paste_blocks('a', { drafts: [{ type: 'quote', content: 'quoted' }] });
                    $mol_assert_equal(editor.block_ids().length, 2);
                    $mol_assert_equal(editor.block_type('a'), 'quote');
                    $mol_assert_equal(editor.block_html('a'), 'quoted');
                }
                finally {
                    drop();
                }
            },
            'block_paste_blocks splits the block around the caret'() {
                const { editor, focused, drop } = make_editor([{ id: 'a', html: 'headtail' }]);
                try {
                    editor.block_paste_blocks('a', {
                        drafts: [
                            { type: 'paragraph', content: 'one' },
                            { type: 'paragraph', content: 'two' },
                        ],
                        head: 'head',
                        tail: 'tail',
                    });
                    const ids = editor.block_ids();
                    $mol_assert_equal(ids.length, 2);
                    $mol_assert_equal(editor.block_html('a'), 'headone');
                    $mol_assert_equal(editor.block_html(ids[1]), 'twotail');
                    // caret lands after the pasted text, in front of the old tail
                    $mol_assert_equal(focused.at(-1), { id: ids[1], offset: 3 });
                }
                finally {
                    drop();
                }
            },
            'block_paste_blocks keeps the kind of the block it was pasted into'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'ab', type: 'quote' }]);
                try {
                    editor.block_paste_blocks('a', {
                        drafts: [{ type: 'heading', content: 'H', level: 1 }],
                        head: 'a',
                        tail: 'b',
                    });
                    $mol_assert_equal(editor.block_type('a'), 'quote');
                    $mol_assert_equal(editor.block_html('a'), 'aHb');
                }
                finally {
                    drop();
                }
            },
            'block_paste_blocks gives the tail its own block after a picture'() {
                const { editor, focused, drop } = make_editor([{ id: 'a', html: 'headtail' }]);
                try {
                    editor.block_paste_blocks('a', {
                        drafts: [{ type: 'image', content: '<img src="x.png">' }],
                        head: 'head',
                        tail: 'tail',
                    });
                    const ids = editor.block_ids();
                    $mol_assert_equal(ids.length, 3);
                    $mol_assert_equal(editor.block_html('a'), 'head');
                    $mol_assert_equal(editor.block_type(ids[1]), 'image');
                    $mol_assert_equal(editor.block_html(ids[2]), 'tail');
                    $mol_assert_equal(focused.at(-1), { id: ids[2], offset: 0 });
                }
                finally {
                    drop();
                }
            },
            'block_paste_blocks inline puts the draft straight into the text'() {
                const { editor, focused, drop } = make_editor([{ id: 'a', html: 'ab' }]);
                try {
                    editor.block_paste_blocks('a', {
                        drafts: [{ type: 'paragraph', content: '<b>X</b>' }],
                        head: 'a',
                        tail: 'b',
                        inline: true,
                    });
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'a<b>X</b>b');
                    $mol_assert_equal(focused.at(-1), { id: 'a', offset: 2 });
                }
                finally {
                    drop();
                }
            },
            'a whole paste is undone in one step'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'headtail' }]);
                try {
                    editor.block_paste_blocks('a', {
                        drafts: [
                            { type: 'paragraph', content: 'one' },
                            { type: 'paragraph', content: 'two' },
                            { type: 'paragraph', content: 'three' },
                        ],
                        head: 'head',
                        tail: 'tail',
                    });
                    $mol_assert_equal(editor.block_ids().length, 3);
                    $mol_assert_equal(editor.history_undo(), true);
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'headtail');
                }
                finally {
                    drop();
                }
            },
            'block_paste_blocks with no drafts returns null'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'text' }]);
                try {
                    $mol_assert_equal(editor.block_paste_blocks('a', { drafts: [] }), null);
                    $mol_assert_equal(editor.block_paste_blocks('a'), null);
                    $mol_assert_equal(editor.block_ids().length, 1);
                }
                finally {
                    drop();
                }
            },
            // === Clipboard end to end ===
            'pasting markdown in the middle of a block splits the article'() {
                const helper = make_editor([
                    { id: 'a', html: 'началоконец' },
                    { id: 'b', html: 'следом' },
                ]);
                try {
                    const { editor } = helper;
                    const block = editor.block_view('a');
                    select_across(helper.node('a'), 6, helper.node('a'), 6);
                    block.paste_data({
                        getData: (type) => type === 'text/html' ? '' : '## Тема\n\nАбзац\n\n- пункт',
                    });
                    const ids = editor.block_ids();
                    $mol_assert_equal(ids.length, 4);
                    $mol_assert_equal(ids[0], 'a');
                    $mol_assert_equal(ids[3], 'b');
                    // the head keeps the kind of the block it was pasted into, the tail rides the last draft
                    $mol_assert_equal(editor.block_html('a'), 'началоТема');
                    $mol_assert_equal(editor.block_type('a'), 'paragraph');
                    $mol_assert_equal(editor.block_html(ids[1]), 'Абзац');
                    $mol_assert_equal(editor.block_type(ids[2]), 'list');
                    $mol_assert_equal(editor.block_html(ids[2]), 'пунктконец');
                }
                finally {
                    helper.drop();
                }
            },
            'pasting a plain line does not add blocks'() {
                const helper = make_editor([{ id: 'a', html: 'началоконец' }]);
                try {
                    const { editor } = helper;
                    select_across(helper.node('a'), 6, helper.node('a'), 6);
                    editor.block_view('a').paste_data({
                        getData: (type) => type === 'text/html' ? '' : 'вставка',
                    });
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), 'началовставкаконец');
                }
                finally {
                    helper.drop();
                }
            },
            'a pasted article is undone by a single step'() {
                const helper = make_editor([{ id: 'a', html: '' }]);
                try {
                    const { editor } = helper;
                    select_across(helper.node('a'), 0, helper.node('a'), 0);
                    editor.block_view('a').paste_data({
                        getData: (type) => type === 'text/html' ? '' : '# Раз\n\nДва\n\nТри\n\nЧетыре',
                    });
                    $mol_assert_equal(editor.block_ids().length, 4);
                    $mol_assert_equal(editor.history_undo(), true);
                    $mol_assert_equal(editor.block_ids(), ['a']);
                    $mol_assert_equal(editor.block_html('a'), '');
                    $mol_assert_equal(editor.history_redo(), true);
                    $mol_assert_equal(editor.block_ids().length, 4);
                }
                finally {
                    helper.drop();
                }
            },
            'block_paste_blocks is refused in readonly mode'() {
                const { editor, drop } = make_editor([{ id: 'a', html: 'text' }]);
                try {
                    editor.readonly = () => true;
                    $mol_assert_equal(editor.block_paste_blocks('a', { drafts: [{ type: 'paragraph', content: 'x' }] }), null);
                    $mol_assert_equal(editor.block_html('a'), 'text');
                }
                finally {
                    drop();
                }
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        $mol_test({
            'register adds plugin to registry'() {
                const registry = $bog_wysiwyg_plugin_registry;
                const before = registry.all().length;
                registry.register({
                    id: '_test_plugin_1',
                    title: 'Test Plugin',
                });
                $mol_assert_equal(registry.all().length, before + 1);
                // cleanup
                registry.plugins.delete('_test_plugin_1');
            },
            'all() returns all registered plugins'() {
                const registry = $bog_wysiwyg_plugin_registry;
                registry.register({ id: '_test_a', title: 'A' });
                registry.register({ id: '_test_b', title: 'B' });
                const all = registry.all();
                const ids = all.map(p => p.id);
                $mol_assert_ok(ids.includes('_test_a'));
                $mol_assert_ok(ids.includes('_test_b'));
                // cleanup
                registry.plugins.delete('_test_a');
                registry.plugins.delete('_test_b');
            },
            'get() returns plugin by id'() {
                const registry = $bog_wysiwyg_plugin_registry;
                registry.register({ id: '_test_get', title: 'Get Test' });
                const plugin = registry.get('_test_get');
                $mol_assert_ok(plugin !== null);
                $mol_assert_equal(plugin.id, '_test_get');
                $mol_assert_equal(plugin.title, 'Get Test');
                // cleanup
                registry.plugins.delete('_test_get');
            },
            'get() returns null for non-existent plugin'() {
                const registry = $bog_wysiwyg_plugin_registry;
                $mol_assert_equal(registry.get('_nonexistent_xyz'), null);
            },
            'commands() includes plugins from registry'() {
                const registry = $bog_wysiwyg_plugin_registry;
                registry.register({ id: '_test_menu', title: 'Menu Test' });
                const menu = new $bog_wysiwyg_menu();
                const cmds = menu.commands();
                const ids = cmds.map(c => c.id);
                $mol_assert_ok(ids.includes('_test_menu'));
                // cleanup
                registry.plugins.delete('_test_menu');
            },
            'apply_menu_command calls plugin on_select'() {
                const registry = $bog_wysiwyg_plugin_registry;
                let called_with_id = '';
                registry.register({
                    id: '_test_select',
                    title: 'Select Test',
                    on_select: (editor, block_id) => {
                        called_with_id = block_id;
                    },
                });
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.focus_block = () => { };
                editor.apply_menu_command('_test_select');
                $mol_assert_equal(called_with_id, 'b1');
                // cleanup
                registry.plugins.delete('_test_select');
            },
            'apply_menu_command for plugin without on_select sets type'() {
                const registry = $bog_wysiwyg_plugin_registry;
                registry.register({
                    id: '_test_noop',
                    title: 'Noop Test',
                });
                const editor = new $bog_wysiwyg();
                editor.active_block_id('b1');
                editor.block_ids(['b1']);
                editor.focus_block = () => { };
                editor.apply_menu_command('_test_noop');
                $mol_assert_equal(editor.block_type('b1'), '_test_noop');
                // cleanup
                registry.plugins.delete('_test_noop');
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    /** Serializes the produced nodes so a test can assert on plain markup. */
    function html_of(source) {
        const doc = $mol_dom_context.document;
        const box = doc.createElement('div');
        for (const node of $bog_journal_post_html_nodes(source, doc))
            box.appendChild(node);
        return box.innerHTML;
    }
    $mol_test({
        'plain text passes through'() {
            $mol_assert_equal(html_of('просто текст'), 'просто текст');
        },
        'the inline set the editor writes survives'() {
            $mol_assert_equal(html_of('<b>ж</b><i>к</i><u>п</u><s>з</s><code>c</code><br>хвост'), '<b>ж</b><i>к</i><u>п</u><s>з</s><code>c</code><br>хвост');
        },
        'strong em del map onto the same four tags'() {
            $mol_assert_equal(html_of('<strong>a</strong><em>b</em><del>c</del><strike>d</strike>'), '<b>a</b><i>b</i><s>c</s><s>d</s>');
        },
        'unknown wrappers are unwrapped, their text stays'() {
            $mol_assert_equal(html_of('<span style="color:red">видно</span>'), 'видно');
            $mol_assert_equal(html_of('<div><font size="3">видно</font></div>'), 'видно');
        },
        'nesting is preserved'() {
            $mol_assert_equal(html_of('<b>ж и <i>к</i></b>'), '<b>ж и <i>к</i></b>');
        },
        'a same-site link stays a plain crawlable anchor'() {
            $mol_assert_equal(html_of('<a href="/journal/post=abc">другая статья</a>'), '<a href="/journal/post=abc">другая статья</a>');
        },
        'an absolute link gets nofollow noopener and a new tab'() {
            $mol_assert_equal(html_of('<a href="https://example.com/a">туда</a>'), '<a href="https://example.com/a" target="_blank" rel="nofollow noopener">туда</a>');
        },
        'an unsafe href is unwrapped to its text'() {
            $mol_assert_equal(html_of('<a href="javascript:alert(1)">клик</a>'), 'клик');
            $mol_assert_equal(html_of('<a href="data:text/html,<b>x</b>">клик</a>'), 'клик');
            $mol_assert_equal(html_of('<a>без адреса</a>'), 'без адреса');
        },
        'scripts, styles and images never reach the page'() {
            $mol_assert_equal(html_of('до<script>alert(1)</script>после'), 'допосле');
            $mol_assert_equal(html_of('до<style>b{color:red}</style>после'), 'допосле');
            $mol_assert_equal(html_of('до<img src="x.png" onerror="alert(1)">после'), 'допосле');
            $mol_assert_equal(html_of('<iframe src="https://evil.dev"></iframe>'), '');
        },
        'attributes other than href are dropped'() {
            $mol_assert_equal(html_of('<b class="c1 c2" data-id="7" style="color:red" onclick="alert(1)">ж</b>'), '<b>ж</b>');
            $mol_assert_equal(html_of('<a href="/x" onclick="alert(1)" class="c1">т</a>'), '<a href="/x">т</a>');
        },
        'text is escaped, never re-parsed as markup'() {
            $mol_assert_equal(html_of('&lt;script&gt;alert(1)&lt;/script&gt;'), '&lt;script&gt;alert(1)&lt;/script&gt;');
            $mol_assert_equal(html_of('a &amp; b'), 'a &amp; b');
        },
        'an empty inline tag is dropped'() {
            $mol_assert_equal(html_of('<b></b>текст<i></i>'), 'текст');
        },
        'nothing in means nothing out'() {
            $mol_assert_equal($bog_journal_post_html_nodes('', $mol_dom_context.document), []);
            $mol_assert_equal($bog_journal_post_html_nodes('   ', $mol_dom_context.document), []);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    function rows_of(...blocks) {
        return $bog_journal_post_rows(blocks);
    }
    $mol_test({
        'paragraph keeps its inline markup'() {
            $mol_assert_equal(rows_of({ type: 'paragraph', content: 'текст с <b>жирным</b>' }), [{ type: 'paragraph', html: 'текст с <b>жирным</b>' }]);
        },
        'heading level is clamped to three'() {
            const rows = rows_of({ type: 'heading', level: 1, content: 'Раз' }, { type: 'heading', level: 3, content: 'Три' }, { type: 'heading', level: 9, content: 'Девять' }, { type: 'heading', level: 0, content: 'Ноль' }, { type: 'heading', content: 'Без уровня' });
            $mol_assert_equal(rows.map(row => row.type === 'heading' ? row.level : 0), [1, 3, 3, 1, 1]);
        },
        'blank blocks disappear'() {
            $mol_assert_equal(rows_of({ type: 'paragraph', content: '' }, { type: 'paragraph', content: '   ' }, { type: 'paragraph', content: '<br>' }, { type: 'paragraph', content: '<b></b>' }, { type: 'paragraph', content: '&nbsp;' }, { type: 'heading', level: 1, content: '<i> </i>' }, { type: 'quote', content: '' }), []);
        },
        'a run of list blocks becomes one list'() {
            $mol_assert_equal(rows_of({ type: 'paragraph', content: 'до' }, { type: 'list', content: 'раз' }, { type: 'list', content: 'два' }, { type: 'list', content: '  ' }, { type: 'list', content: 'три' }, { type: 'paragraph', content: 'после' }, { type: 'list', content: 'отдельный' }), [
                { type: 'paragraph', html: 'до' },
                { type: 'list', items: ['раз', 'два', 'три'] },
                { type: 'paragraph', html: 'после' },
                { type: 'list', items: ['отдельный'] },
            ]);
        },
        'a list of only blank items is dropped'() {
            $mol_assert_equal(rows_of({ type: 'list', content: '' }, { type: 'list', content: '<br>' }), []);
        },
        'divider needs no content'() {
            $mol_assert_equal(rows_of({ type: 'divider', content: '' }), [{ type: 'divider' }]);
        },
        'image block is reduced to source and caption'() {
            $mol_assert_equal(rows_of({ type: 'image', content: '<img src="https://x.dev/a.png" alt="схема">' }), [{ type: 'image', src: 'https://x.dev/a.png', alt: 'схема' }]);
        },
        'image keeps a data uri and an escaped source as is'() {
            const data = 'data:image/png;base64,iVBORw0KGgo=';
            $mol_assert_equal(rows_of({ type: 'image', content: '<img src="' + data + '">' }), [{ type: 'image', src: data, alt: '' }]);
            $mol_assert_equal(rows_of({ type: 'image', content: '<img src="?BAZA:file=a_b;name=c.png">' })[0], { type: 'image', src: '?BAZA:file=a_b;name=c.png', alt: '' });
            $mol_assert_equal(rows_of({ type: 'image', content: "<img alt='a &amp; b' src='/i/p.jpg'>" })[0], { type: 'image', src: '/i/p.jpg', alt: 'a & b' });
        },
        'image without a usable source is dropped'() {
            $mol_assert_equal(rows_of({ type: 'image', content: '<img alt="нет">' }, { type: 'image', content: '<img src="javascript:alert(1)">' }, { type: 'image', content: '' }), []);
        },
        'code is unescaped and its language is taken from the class'() {
            $mol_assert_equal(rows_of({ type: 'code', content: '<code class="language-ts">const a = 1 &lt; 2 &amp;&amp; 3 &gt; 2</code>' }), [{ type: 'code', lang: 'ts', text: 'const a = 1 < 2 && 3 > 2' }]);
        },
        'code without a wrapper still works'() {
            $mol_assert_equal(rows_of({ type: 'code', content: 'plain &lt;div&gt;' }), [{ type: 'code', lang: '', text: 'plain <div>' }]);
        },
        'double escaping decodes exactly once'() {
            $mol_assert_equal(rows_of({ type: 'code', content: '&amp;lt;b&amp;gt;' })[0], { type: 'code', lang: '', text: '&lt;b&gt;' });
        },
        'numeric entities in code are decoded'() {
            $mol_assert_equal(rows_of({ type: 'code', content: '&#39;a&#x27;b&#39;' })[0], { type: 'code', lang: '', text: "'a'b'" });
        },
        'line breaks inside code survive as newlines'() {
            $mol_assert_equal(rows_of({ type: 'code', content: 'first<br>second' })[0], { type: 'code', lang: '', text: 'first\nsecond' });
        },
        'empty code block is dropped'() {
            $mol_assert_equal(rows_of({ type: 'code', content: '' }, { type: 'code', content: '   ' }), []);
        },
        'unknown block type falls back to a paragraph'() {
            $mol_assert_equal(rows_of({ type: 'callout', content: 'подсказка' }, { type: '', content: 'без типа' }), [{ type: 'paragraph', html: 'подсказка' }, { type: 'paragraph', html: 'без типа' }]);
        },
        'a whole article keeps its order'() {
            const rows = rows_of({ type: 'heading', level: 1, content: 'Заголовок' }, { type: 'paragraph', content: 'Вступление' }, { type: 'quote', content: 'Цитата' }, { type: 'list', content: 'раз' }, { type: 'list', content: 'два' }, { type: 'code', content: '<code class="language-js">x()</code>' }, { type: 'divider', content: '' }, { type: 'image', content: '<img src="/a.png" alt="">' }, { type: 'paragraph', content: 'Финал' });
            $mol_assert_equal(rows.map(row => row.type), ['heading', 'paragraph', 'quote', 'list', 'code', 'divider', 'image', 'paragraph']);
        },
        'no blocks means no rows'() {
            $mol_assert_equal($bog_journal_post_rows([]), []);
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        /**
         * Page fed with rows directly, so nothing here touches Giper Baza. An empty
         * `post_link` keeps `post()` at null, which makes every model read a no-op.
         */
        function page_of($, rows, config = {}) {
            return $bog_journal_post_page.make({ $, rows: () => rows, ...config });
        }
        function markup_of($, rows) {
            return page_of($, rows).Body().dom_tree().innerHTML;
        }
        $mol_test({
            'body headings render as real h2 h3 h4 under the h1 title'($) {
                const html = markup_of($, [
                    { type: 'heading', level: 1, html: 'Раз' },
                    { type: 'heading', level: 2, html: 'Два' },
                    { type: 'heading', level: 3, html: 'Три' },
                ]);
                $mol_assert_equal(/<h2[^>]*>Раз<\/h2>/.test(html), true);
                $mol_assert_equal(/<h3[^>]*>Два<\/h3>/.test(html), true);
                $mol_assert_equal(/<h4[^>]*>Три<\/h4>/.test(html), true);
            },
            'every block type gets the element a crawler expects'($) {
                const html = markup_of($, [
                    { type: 'paragraph', html: 'абзац' },
                    { type: 'quote', html: 'цитата' },
                    { type: 'list', items: ['раз', 'два'] },
                    { type: 'code', lang: 'ts', text: 'const a = 1' },
                    { type: 'divider' },
                    { type: 'image', src: '/a.png', alt: 'схема' },
                ]);
                $mol_assert_equal(/<p[^>]*>абзац<\/p>/.test(html), true);
                $mol_assert_equal(/<blockquote[^>]*>цитата<\/blockquote>/.test(html), true);
                $mol_assert_equal(/<ul[^>]*>.*<li[^>]*>раз<\/li>.*<li[^>]*>два<\/li>.*<\/ul>/s.test(html), true);
                $mol_assert_equal(/<pre[^>]*>const a = 1<\/pre>/.test(html), true);
                $mol_assert_equal(/<hr[^>]*>/.test(html), true);
                $mol_assert_equal(/<img[^>]*src="\/a\.png"/.test(html), true);
                $mol_assert_equal(/<img[^>]*alt="схема"/.test(html), true);
            },
            'the whole body is in the dom, nothing is virtualized away'($) {
                const rows = [];
                for (let i = 0; i < 200; i++)
                    rows.push({ type: 'paragraph', html: 'абзац ' + i });
                const html = markup_of($, rows);
                $mol_assert_equal(html.includes('абзац 0'), true);
                $mol_assert_equal(html.includes('абзац 199'), true);
                $mol_assert_equal((html.match(/<p[^>]*>/g) ?? []).length, 200);
            },
            'inline markup of a block survives into the element'($) {
                const html = markup_of($, [{ type: 'paragraph', html: 'а <b>б</b> и <a href="/x">в</a>' }]);
                $mol_assert_equal(html.includes('<b>б</b>'), true);
                $mol_assert_equal(html.includes('<a href="/x">в</a>'), true);
            },
            'code language becomes an attribute, absent when unknown'($) {
                $mol_assert_equal(markup_of($, [{ type: 'code', lang: 'ts', text: 'x' }]).includes('bog_journal_post_lang="ts"'), true);
                $mol_assert_equal(markup_of($, [{ type: 'code', lang: '', text: 'x' }]).includes('bog_journal_post_lang'), false);
            },
            'the root is an article and the title is the only h1'($) {
                // The byline is left out on purpose: rendering $mol_link needs a location,
                // and the node bundle has none. Its own tests below cover it.
                const page = page_of($, [{ type: 'heading', level: 1, html: 'Внутри' }], {
                    post_title: () => 'Заголовок статьи',
                    byline_content: () => [],
                });
                const node = page.dom_tree();
                $mol_assert_equal(node.tagName.toLowerCase(), 'article');
                $mol_assert_equal(node.querySelectorAll('h1').length, 1);
                $mol_assert_equal(node.querySelector('h1')?.textContent, 'Заголовок статьи');
                $mol_assert_equal(node.querySelector('header') !== null, true);
            },
            /**
             * Asserted without rendering: $mol_state_arg has no href in the node bundle,
             * so $mol_link cannot build a uri there. What this module owns is the choice
             * of $mol_link over a click handler, and the route it points at.
             */
            'the author profile is an anchor carrying the author route'($) {
                const page = page_of($, [], {
                    author_id: () => 'aaaa_bbbb',
                    author_name: () => 'Аня',
                });
                const link = page.Author_link();
                $mol_assert_equal(link instanceof $mol_link, true);
                $mol_assert_equal(link.dom_name(), 'a');
                $mol_assert_equal(link.arg(), { author: 'aaaa_bbbb', post: null });
                $mol_assert_equal(page.author_label(), 'Аня');
            },
            'publication date is a machine readable time element'($) {
                const page = page_of($, [], { published_ms: () => Date.UTC(2026, 6, 15, 12) });
                const time = page.Published().dom_tree();
                const stamp = time.getAttribute('datetime') ?? '';
                $mol_assert_equal(time.tagName.toLowerCase(), 'time');
                $mol_assert_equal(/^\d{4}-\d{2}-\d{2}$/.test(stamp), true);
                $mol_assert_equal(time.textContent, stamp);
            },
            'an unpublished post shows a draft marker instead of a date'($) {
                const draft = page_of($, []);
                $mol_assert_equal(draft.byline_content()[0] === draft.Draft(), true);
                const live = page_of($, [], { published_ms: () => Date.UTC(2026, 6, 15, 12) });
                $mol_assert_equal(live.byline_content()[0] === live.Published(), true);
            },
            'meta stays readable when the author has no name yet'($) {
                const page = page_of($, [], { post_title: () => 'Тема', author_name: () => '' });
                $mol_assert_equal(page.meta().title, 'Тема');
            },
            'meta carries title, description, canonical and the article type'($) {
                const page = page_of($, [], {
                    post_title: () => 'Как это работает',
                    post_summary: () => 'Короткое описание',
                    author_name: () => 'Аня',
                    canonical: () => 'https://b-on-g.github.io/journal/author=a/post=b',
                });
                const meta = page.meta();
                $mol_assert_equal(meta.title, 'Как это работает — Аня');
                $mol_assert_equal(meta.og_title, 'Как это работает — Аня');
                $mol_assert_equal(meta.description, 'Короткое описание');
                $mol_assert_equal(meta.og_description, 'Короткое описание');
                $mol_assert_equal(meta.canonical, 'https://b-on-g.github.io/journal/author=a/post=b');
                $mol_assert_equal(meta.og_type, 'article');
            },
            'meta reaches the dom as data-bog-meta on the root'($) {
                const page = page_of($, [], {
                    post_title: () => 'Тема',
                    author_name: () => 'Аня',
                    byline_content: () => [],
                });
                const raw = page.dom_tree().getAttribute('data-bog-meta');
                $mol_assert_equal(typeof raw, 'string');
                $mol_assert_equal(JSON.parse(raw ?? '{}').title, 'Тема — Аня');
            },
            'og:image is dropped when no node can serve the file'($) {
                const page = page_of($, [], { file_base: () => '' });
                $mol_assert_equal(page.meta().og_image, '');
                $mol_assert_equal('og_image' in ($bog_meta_compact(page.meta()) ?? {}), false);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    /**
     * Merging and link parsing are pure on purpose, so they can be covered here
     * without touching Giper Baza: a test that opens a Land hangs forever and
     * takes every MAM build down with it.
     */
    function item(over = {}) {
        return {
            post: 'AAAAAAAA_BBBBBBBB',
            author: 'AAAAAAAA',
            author_name: 'Author',
            avatar: '',
            title: 'Title',
            summary: '',
            cover: '',
            published: 1,
            tags: [],
            ...over,
        };
    }
    $mol_test({
        'merge orders posts newest first'() {
            const merged = $bog_journal_feed_merge([
                [item({ post: 'a', published: 100 }), item({ post: 'b', published: 300 })],
                [item({ post: 'c', published: 200 })],
            ]);
            $mol_assert_equal(merged.map(post => post.post).join(' '), 'b c a');
        },
        'merge drops drafts from every journal'() {
            const merged = $bog_journal_feed_merge([
                [item({ post: 'a', published: 0 })],
                [item({ post: 'b', published: 5 }), item({ post: 'c', published: 0 })],
            ]);
            $mol_assert_equal(merged.map(post => post.post).join(' '), 'b');
        },
        'merge drops items without a link'() {
            const merged = $bog_journal_feed_merge([
                [item({ post: '', published: 9 }), item({ post: 'a', published: 8 })],
            ]);
            $mol_assert_equal(merged.map(post => post.post).join(' '), 'a');
        },
        'merge dedupes the same post listed twice'() {
            const merged = $bog_journal_feed_merge([
                [item({ post: 'a', published: 100, author_name: 'First' })],
                [item({ post: 'a', published: 100, author_name: 'Second' })],
            ]);
            $mol_assert_equal(merged.length, 1);
            $mol_assert_equal(merged[0].author_name, 'First');
        },
        'merge breaks a timestamp tie by link'() {
            const merged = $bog_journal_feed_merge([
                [item({ post: 'zz', published: 7 })],
                [item({ post: 'aa', published: 7 })],
            ]);
            $mol_assert_equal(merged.map(post => post.post).join(' '), 'aa zz');
        },
        'merge of nothing is empty'() {
            $mol_assert_equal($bog_journal_feed_merge([]).length, 0);
            $mol_assert_equal($bog_journal_feed_merge([[], []]).length, 0);
        },
        'merge keeps a slow journal from hiding the ready ones'() {
            // An unfinished Land contributes an empty slice, never an exception.
            const merged = $bog_journal_feed_merge([
                [],
                [item({ post: 'a', published: 1 })],
                [],
            ]);
            $mol_assert_equal(merged.map(post => post.post).join(' '), 'a');
        },
        'link parse takes a bare link as is'() {
            $mol_assert_equal($bog_journal_feed_link_parse('AAAAAAAA_BBBBBBBB'), 'AAAAAAAA_BBBBBBBB');
            $mol_assert_equal($bog_journal_feed_link_parse('  AAAAAAAA  '), 'AAAAAAAA');
        },
        'link parse pulls the journal out of an app url'() {
            $mol_assert_equal($bog_journal_feed_link_parse('https://b-on-g.dev/journal/author=AAAAAAAA_BBBBBBBB'), 'AAAAAAAA_BBBBBBBB');
            $mol_assert_equal($bog_journal_feed_link_parse('https://b-on-g.dev/#!author=AAAAAAAA_BBBBBBBB/post=CCCCCCCC'), 'AAAAAAAA_BBBBBBBB');
        },
        'link parse trims the empty tail groups'() {
            $mol_assert_equal($bog_journal_feed_link_parse('AAAAAAAA_BBBBBBBB__'), 'AAAAAAAA_BBBBBBBB');
        },
        'link parse rejects anything malformed'() {
            $mol_assert_equal($bog_journal_feed_link_parse(''), '');
            $mol_assert_equal($bog_journal_feed_link_parse('   '), '');
            $mol_assert_equal($bog_journal_feed_link_parse('not a link'), '');
            $mol_assert_equal($bog_journal_feed_link_parse('AAAA'), '');
            $mol_assert_equal($bog_journal_feed_link_parse('AAAAAAAA_BBBB'), '');
            $mol_assert_equal($bog_journal_feed_link_parse('https://b-on-g.dev/journal/'), '');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    const base = 'https://baza.test/';
    const md = (blocks, config) => $bog_wysiwyg_export_markdown(blocks, config);
    $mol_test({
        // === Block types ===
        'paragraph keeps inline formatting'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'Hello <b>bold</b> and <i>italic</i>' }]), 'Hello **bold** and *italic*');
        },
        'paragraph turns br into a hard line break'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'one<br>two' }]), 'one  \ntwo');
        },
        'paragraph turns div soup into lines'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: '<div>one</div><div>two</div>' }]), 'one  \ntwo');
        },
        'heading levels 1 to 3'() {
            $mol_assert_equal(md([{ type: 'heading', level: 1, content: 'One' }]), '# One');
            $mol_assert_equal(md([{ type: 'heading', level: 2, content: 'Two' }]), '## Two');
            $mol_assert_equal(md([{ type: 'heading', level: 3, content: 'Three' }]), '### Three');
        },
        'heading without a level falls back to the first one'() {
            $mol_assert_equal(md([{ type: 'heading', content: 'One' }]), '# One');
        },
        'code block is fenced and unescaped'() {
            $mol_assert_equal(md([{ type: 'code', content: 'if( a &lt; b ) {\n\treturn 1\n}' }]), '```\nif( a < b ) {\n\treturn 1\n}\n```');
        },
        'code block with its own fence gets a longer one'() {
            $mol_assert_equal(md([{ type: 'code', content: '```\nnested\n```' }]), '````\n```\nnested\n```\n````');
        },
        'quote prefixes every line'() {
            $mol_assert_equal(md([{ type: 'quote', content: 'Wise<br>words' }]), '> Wise  \n> words');
        },
        'neighbour list blocks make one list'() {
            $mol_assert_equal(md([
                { type: 'list', content: 'one' },
                { type: 'list', content: 'two' },
                { type: 'paragraph', content: 'tail' },
            ]), '- one\n- two\n\ntail');
        },
        'list block with its own markup keeps nesting'() {
            $mol_assert_equal(md([{ type: 'list', content: '<ul><li>a</li><li>b<ul><li>c</li></ul></li></ul>' }]), '- a\n- b\n  - c');
        },
        'ordered list is numbered'() {
            $mol_assert_equal(md([{ type: 'list', content: '<ol><li>a</li><li>b</li></ol>' }]), '1. a\n2. b');
        },
        'divider'() {
            $mol_assert_equal(md([{ type: 'divider', content: '' }]), '---');
        },
        'unknown block type is rendered as a paragraph'() {
            $mol_assert_equal(md([{ type: 'callout', content: 'Beware of <b>dogs</b>' }]), 'Beware of **dogs**');
        },
        'empty blocks are dropped'() {
            $mol_assert_equal(md([
                { type: 'paragraph', content: '' },
                { type: 'paragraph', content: '<br>' },
                { type: 'paragraph', content: 'alone' },
                { type: 'heading', level: 1, content: '   ' },
            ]), 'alone');
        },
        'no blocks means no markdown'() {
            $mol_assert_equal(md([]), '');
        },
        // === Inline ===
        'link'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'see <a href="https://mol.hyoo.ru/">mol</a>' }]), 'see [mol](https://mol.hyoo.ru/)');
        },
        'link with parens in the address is percent encoded'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: '<a href="https://x.dev/a(b)">l</a>' }]), '[l](https://x.dev/a%28b%29)');
        },
        'wiki link stays an anchor'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: '<a data-wiki-link="page_1" href="#page_1">page_1</a>' }], { base }), '[page\\_1](#page_1)');
        },
        'inline code with a backtick gets a double fence'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: '<code>a`b</code>' }]), '``a`b``');
        },
        'strike'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: '<s>gone</s> <del>too</del>' }]), '~~gone~~ ~~too~~');
        },
        'html entities are decoded'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'a &amp; b &nbsp; &mdash; &#65;&#x42;' }]), 'a & b — AB');
        },
        'unbalanced markup still closes'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'a <b>bold' }]), 'a **bold**');
        },
        // === Escaping ===
        'markdown punctuation in plain text is escaped'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'a * b _ c [d] ~e~ \\f' }]), 'a \\* b \\_ c \\[d\\] \\~e\\~ \\\\f');
        },
        'line openers are escaped only at the line start'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: '# not a heading' }]), '\\# not a heading');
            $mol_assert_equal(md([{ type: 'paragraph', content: '> not a quote' }]), '\\> not a quote');
            $mol_assert_equal(md([{ type: 'paragraph', content: '- not a list' }]), '\\- not a list');
            $mol_assert_equal(md([{ type: 'paragraph', content: '1. not a list' }]), '1\\. not a list');
            $mol_assert_equal(md([{ type: 'paragraph', content: 'and 1. not a list' }]), 'and 1. not a list');
        },
        'telegram never escapes, because clients show the backslashes'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'a * b _ c [d] # e' }], { dialect: 'telegram' }), 'a * b _ c [d] # e');
        },
        // === Habr ===
        'habr shifts headings down, the article title already owns h1'() {
            $mol_assert_equal(md([{ type: 'heading', level: 1, content: 'One' }], { dialect: 'habr' }), '## One');
            $mol_assert_equal(md([{ type: 'heading', level: 3, content: 'Three' }], { dialect: 'habr' }), '#### Three');
        },
        'habr drops underline, there is no markdown for it'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'a <u>b</u> c' }], { dialect: 'habr' }), 'a b c');
            $mol_assert_equal(md([{ type: 'paragraph', content: 'a <u>b</u> c' }]), 'a <u>b</u> c');
        },
        'habr renders a table as a nested list'() {
            $mol_assert_equal(md([{
                    type: 'table',
                    content: '<table><tr><th>Name</th><th>Age</th></tr><tr><td>Ann</td><td>3</td></tr><tr><td>Bob</td><td>4</td></tr></table>',
                }], { dialect: 'habr' }), '- **Ann**\n  - Age: 3\n- **Bob**\n  - Age: 4');
        },
        'habr flattens a headless table into one bullet per row'() {
            $mol_assert_equal(md([{
                    type: 'table',
                    content: '<table><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr></table>',
                }], { dialect: 'habr' }), '- a — b\n- c — d');
        },
        'a table pasted as markdown text is reformatted too'() {
            $mol_assert_equal(md([{ type: 'table', content: '| a | b |<br>| --- | --- |<br>| 1 | 2 |' }], { dialect: 'habr' }), '- **1**\n  - b: 2');
        },
        // === Common and dev.to tables ===
        'gfm table for dialects that render tables'() {
            const table = {
                type: 'table',
                content: '<table><tr><th>Name</th><th>Age</th></tr><tr><td>Ann</td><td>3</td></tr></table>',
            };
            $mol_assert_equal(md([table]), '| Name | Age |\n| --- | --- |\n| Ann | 3 |');
            $mol_assert_equal(md([table], { dialect: 'devto' }).split('---\n\n')[1], '| Name | Age |\n| --- | --- |\n| Ann | 3 |');
        },
        'pipes inside cells are escaped'() {
            $mol_assert_equal(md([{ type: 'table', content: '<table><tr><td>a|b</td><td>c</td></tr></table>' }]), '| a\\|b | c |\n| --- | --- |');
        },
        // === dev.to ===
        'devto prepends a front matter'() {
            $mol_assert_equal(md([{ type: 'paragraph', content: 'Body' }], {
                dialect: 'devto',
                title: 'My post',
                tags: ['mol', 'javascript'],
                published: true,
            }), '---\ntitle: "My post"\npublished: true\ntags: mol, javascript\n---\n\nBody');
        },
        'devto tags are sanitized down to four'() {
            $mol_assert_equal(md([], { dialect: 'devto', tags: ['Java Script', '#ts', '', 'a', 'b', 'c'] }), '---\ntitle: ""\npublished: false\ntags: javascript, ts, a, b\n---');
        },
        'devto quotes the title and absolutizes the cover'() {
            $mol_assert_equal(md([], {
                dialect: 'devto',
                title: 'A "quoted": title',
                cover: '?BAZA:file=cov;name=c.png',
                base,
            }), '---\ntitle: "A \\"quoted\\": title"\npublished: false\ntags: \ncover_image: "https://baza.test/?BAZA:file=cov;name=c.png"\n---');
        },
        // === Telegram ===
        'telegram turns headings into bold lines'() {
            $mol_assert_equal(md([{ type: 'heading', level: 2, content: 'Sub' }], { dialect: 'telegram' }), '**Sub**');
        },
        'telegram uses its own italic, bullet and divider'() {
            $mol_assert_equal(md([
                { type: 'paragraph', content: '<i>slanted</i>' },
                { type: 'list', content: 'item' },
                { type: 'divider', content: '' },
            ], { dialect: 'telegram' }), '__slanted__\n\n• item\n\n————————');
        },
        'telegram cannot embed images, so a bare address is left'() {
            $mol_assert_equal(md([{ type: 'image', content: '<img src="?BAZA:file=abc;name=pic.png" alt="Pic">' }], {
                dialect: 'telegram',
                base,
            }), 'https://baza.test/?BAZA:file=abc;name=pic.png');
        },
        'telegram has a message limit'() {
            $mol_assert_equal($bog_wysiwyg_export_limit('telegram'), 4096);
            $mol_assert_equal($bog_wysiwyg_export_limit('common'), Infinity);
            $mol_assert_equal($bog_wysiwyg_export_limit('habr'), Infinity);
            $mol_assert_equal($bog_wysiwyg_export_limit('devto'), Infinity);
        },
        // === Splitting ===
        'short text is a single message'() {
            $mol_assert_equal($bog_wysiwyg_export_split('hello', 4096).length, 1);
            $mol_assert_equal($bog_wysiwyg_export_split('', 4096).length, 0);
        },
        'split prefers block boundaries'() {
            const parts = $bog_wysiwyg_export_split('aaaa\n\nbbbb\n\ncccc', 10);
            $mol_assert_equal(parts.length, 2);
            $mol_assert_equal(parts[0], 'aaaa\n\nbbbb');
            $mol_assert_equal(parts[1], 'cccc');
        },
        'split falls back to lines and then to hard cuts'() {
            $mol_assert_equal($bog_wysiwyg_export_split('aa\nbb\ncc', 5), ['aa\nbb', 'cc']);
            $mol_assert_equal($bog_wysiwyg_export_split('abcdefgh', 3), ['abc', 'def', 'gh']);
        },
        'every telegram message fits the limit'() {
            const blocks = Array.from({ length: 60 }, (_, i) => ({
                type: 'paragraph',
                content: 'Paragraph number ' + i + ' ' + 'x'.repeat(100),
            }));
            const text = md(blocks, { dialect: 'telegram' });
            const parts = $bog_wysiwyg_export_split(text, $bog_wysiwyg_export_limit('telegram'));
            $mol_assert_ok(parts.length > 1);
            for (const part of parts)
                $mol_assert_ok(part.length <= 4096);
        },
        // === Images ===
        'baza file address is resolved against the master node'() {
            $mol_assert_equal(md([{ type: 'image', content: '<img src="?BAZA:file=abc;name=pic.png" alt="Pic">' }], { base }), '![Pic](https://baza.test/?BAZA:file=abc;name=pic.png)');
        },
        'image without an alt'() {
            $mol_assert_equal(md([{ type: 'image', content: '<img src="https://x.dev/p.png">' }]), '![](https://x.dev/p.png)');
        },
        'absolute and data addresses are left alone'() {
            $mol_assert_equal($bog_wysiwyg_export_uri('https://a/b.png', base), 'https://a/b.png');
            $mol_assert_equal($bog_wysiwyg_export_uri('data:image/png;base64,AAA', base), 'data:image/png;base64,AAA');
            $mol_assert_equal($bog_wysiwyg_export_uri('//a/b.png', base), '//a/b.png');
            $mol_assert_equal($bog_wysiwyg_export_uri('#anchor', base), '#anchor');
            $mol_assert_equal($bog_wysiwyg_export_uri('/x.png', base), 'https://baza.test/x.png');
            $mol_assert_equal($bog_wysiwyg_export_uri('?BAZA:file=x;name=y', base), 'https://baza.test/?BAZA:file=x;name=y');
            $mol_assert_equal($bog_wysiwyg_export_uri('?BAZA:file=x', 'https://baza.test'), 'https://baza.test/?BAZA:file=x');
            $mol_assert_equal($bog_wysiwyg_export_uri('?BAZA:file=x', ''), '?BAZA:file=x');
            $mol_assert_equal($bog_wysiwyg_export_uri('', base), '');
        },
        'images apart are numbered in place and listed at the end'() {
            $mol_assert_equal(md([
                { type: 'paragraph', content: 'before <img src="https://x.dev/a.png" alt="A"> after' },
                { type: 'image', content: '<img src="?BAZA:file=b;name=b.png">' },
            ], {
                base,
                images_apart: true,
                labels: { image: 'Picture', images: 'Pictures' },
            }), 'before [Picture 1] after\n\n[Picture 2]'
                + '\n\n## Pictures\n\n1. A — https://x.dev/a.png\n2. https://baza.test/?BAZA:file=b;name=b.png');
        },
        'telegram lists images under a bold title'() {
            $mol_assert_equal(md([{ type: 'image', content: '<img src="https://x.dev/a.png">' }], {
                dialect: 'telegram',
                images_apart: true,
                labels: { image: 'Pic', images: 'Pics' },
            }), '[Pic 1]\n\n**Pics**\n\n1. https://x.dev/a.png');
        },
        // === Plain text helper ===
        'plain strips tags and decodes entities'() {
            $mol_assert_equal($bog_wysiwyg_export_plain('<p>a<br>b &lt;c&gt;</p>'), 'a\nb <c>');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'latin title collapses to dashes'() {
            $mol_assert_equal($bog_journal_edit_slug('Hello, World!'), 'hello-world');
        },
        'cyrillic is transliterated'() {
            $mol_assert_equal($bog_journal_edit_slug('Привет, мир'), 'privet-mir');
        },
        'soft sign disappears instead of becoming a dash'() {
            $mol_assert_equal($bog_journal_edit_slug('Пять статей'), 'pyat-statey');
        },
        'leading and trailing junk is trimmed'() {
            $mol_assert_equal($bog_journal_edit_slug('  --- $mol ---  '), 'mol');
        },
        'the 80 char cut leaves no trailing dash'() {
            const long = 'a'.repeat(79) + ' tail';
            $mol_assert_equal($bog_journal_edit_slug(long), 'a'.repeat(79));
        },
        'empty input stays empty'() {
            $mol_assert_equal($bog_journal_edit_slug(''), '');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Special'() {
            $mol_assert_equal($mol_si_short(0), '0');
            $mol_assert_equal($mol_si_short(1 / 0), '∞');
            $mol_assert_equal($mol_si_short(-1 / 0), '-∞');
            $mol_assert_equal($mol_si_short(0 / 0), '∅');
        },
        'M'() {
            $mol_assert_equal($mol_si_short(0), '0');
            $mol_assert_equal($mol_si_short(0.999500), '1.00');
            $mol_assert_equal($mol_si_short(-0.999600), '-1.00');
            $mol_assert_equal($mol_si_short(999.4), '999');
            $mol_assert_equal($mol_si_short(-999.4), '-999');
        },
        'L'() {
            $mol_assert_equal($mol_si_short(999.5), '1.00k');
            $mol_assert_equal($mol_si_short(-999.5), '-1.00k');
            $mol_assert_equal($mol_si_short(999_400), '999k');
            $mol_assert_equal($mol_si_short(-999_400), '-999k');
        },
        'XL'() {
            $mol_assert_equal($mol_si_short(999_500), '1.00M');
            $mol_assert_equal($mol_si_short(-999_600), '-1.00M');
            $mol_assert_equal($mol_si_short(999_400_000), '999M');
            $mol_assert_equal($mol_si_short(-999_400_000), '-999M');
        },
        'S'() {
            $mol_assert_equal($mol_si_short(0.999400), '999m');
            $mol_assert_equal($mol_si_short(-0.999400), '-999m');
            $mol_assert_equal($mol_si_short(0.000_999_500), '1.00m');
            $mol_assert_equal($mol_si_short(-0.000_999_500), '-1.00m');
        },
        'XS'() {
            $mol_assert_equal($mol_si_short(0.000_999_400), '999µ');
            $mol_assert_equal($mol_si_short(-0.000_999_400), '-999µ');
            $mol_assert_equal($mol_si_short(0.000_000_999_600), '1.00µ');
            $mol_assert_equal($mol_si_short(-0.000_000_999_600), '-1.00µ');
        },
        'With unit'() {
            $mol_assert_equal($mol_si_short(0, 's'), '0 s');
            $mol_assert_equal($mol_si_short(1 / 0, 's'), '∞ s');
            $mol_assert_equal($mol_si_short(0 / 0, 's'), '∅ s');
            $mol_assert_equal($mol_si_short(123, 'Hz'), '123 Hz');
            $mol_assert_equal($mol_si_short(1234, 'g'), '1.23 kg');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'simple sort'() {
            const list = ['abc', 'ac', 'ab'];
            list.sort($mol_compare_text());
            $mol_assert_equal(`${list}`, 'ab,abc,ac');
        },
        'sort ignoring spaces around'() {
            const list = [' a', '\tb', ' b'];
            list.sort($mol_compare_text());
            $mol_assert_equal(`${list}`, ' a,\tb, b');
        },
        'sort ignoring letter case'() {
            const list = ['A', 'B', 'a'];
            list.sort($mol_compare_text());
            $mol_assert_equal(`${list}`, 'A,a,B');
        },
        'sort with custom serializer'() {
            const list = ['abc', 'ab', 'ac'];
            list.sort($mol_compare_text(str => str.split('').reverse().join('')));
            $mol_assert_equal(`${list}`, 'ab,ac,abc');
        },
    });
})($ || ($ = {}));

;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Vector limiting'() {
            let point = new $mol_vector_3d(7, 10, 13);
            const res = point.limited([[1, 5], [15, 20], [5, 10]]);
            $mol_assert_equal(res.x, 5);
            $mol_assert_equal(res.y, 15);
            $mol_assert_equal(res.z, 10);
        },
        'Vector adding scalar'() {
            let point = new $mol_vector_3d(1, 2, 3);
            let res = point.added0(5);
            $mol_assert_equal(res.x, 6);
            $mol_assert_equal(res.y, 7);
            $mol_assert_equal(res.z, 8);
        },
        'Vector adding vector'() {
            let point = new $mol_vector_3d(1, 2, 3);
            let res = point.added1([5, 10, 15]);
            $mol_assert_equal(res.x, 6);
            $mol_assert_equal(res.y, 12);
            $mol_assert_equal(res.z, 18);
        },
        'Vector multiplying scalar'() {
            let point = new $mol_vector_3d(2, 3, 4);
            let res = point.multed0(-1);
            $mol_assert_equal(res.x, -2);
            $mol_assert_equal(res.y, -3);
            $mol_assert_equal(res.z, -4);
        },
        'Vector multiplying vector'() {
            let point = new $mol_vector_3d(2, 3, 4);
            let res = point.multed1([5, 2, -2]);
            $mol_assert_equal(res.x, 10);
            $mol_assert_equal(res.y, 6);
            $mol_assert_equal(res.z, -8);
        },
        'Matrix adding matrix'() {
            let matrix = new $mol_vector_matrix(...[[1, 2], [3, 4], [5, 6]]);
            let res = matrix.added2([[10, 20], [30, 40], [50, 60]]);
            $mol_assert_equal(res[0][0], 11);
            $mol_assert_equal(res[0][1], 22);
            $mol_assert_equal(res[1][0], 33);
            $mol_assert_equal(res[1][1], 44);
            $mol_assert_equal(res[2][0], 55);
            $mol_assert_equal(res[2][1], 66);
        },
        'Matrix multiplying matrix'() {
            let matrix = new $mol_vector_matrix(...[[2, 3], [4, 5], [6, 7]]);
            let res = matrix.multed2([[2, 3], [4, 5], [6, 7]]);
            $mol_assert_equal(res[0][0], 4);
            $mol_assert_equal(res[0][1], 9);
            $mol_assert_equal(res[1][0], 16);
            $mol_assert_equal(res[1][1], 25);
            $mol_assert_equal(res[2][0], 36);
            $mol_assert_equal(res[2][1], 49);
        },
        'Range expanding'() {
            let range = $mol_vector_range_full.inversed;
            const expanded = range.expanded0(10).expanded0(5);
            $mol_assert_like([...expanded], [5, 10]);
        },
        'Vector of range expanding by vector'() {
            let dimensions = new $mol_vector_2d($mol_vector_range_full.inversed, $mol_vector_range_full.inversed);
            const expanded = dimensions.expanded1([1, 7]).expanded1([3, 5]);
            $mol_assert_like([...expanded.x], [1, 3]);
            $mol_assert_like([...expanded.y], [5, 7]);
        },
        'Vector of range expanding by vector of range'() {
            let dimensions = new $mol_vector_2d($mol_vector_range_full.inversed, $mol_vector_range_full.inversed);
            const expanded = dimensions
                .expanded2([[1, 3], [7, 9]])
                .expanded2([[2, 4], [6, 8]]);
            $mol_assert_like([...expanded.x], [1, 4]);
            $mol_assert_like([...expanded.y], [6, 9]);
        },
        'Vector of infinity range expanding by vector of range'() {
            let dimensions = new $mol_vector_2d($mol_vector_range_full.inversed, $mol_vector_range_full.inversed);
            const next = new $mol_vector_2d($mol_vector_range_full.inversed, $mol_vector_range_full.inversed);
            const expanded = next
                .expanded2(dimensions);
            $mol_assert_like([...expanded.x], [Infinity, -Infinity]);
            $mol_assert_like([...expanded.y], [Infinity, -Infinity]);
        },
    });
})($ || ($ = {}));


//# sourceMappingURL=web.test.js.map
