/*global document,self, opera, console*/
/**
 * Created for multilating cookies(include setting, getting and deleting)
 * User: Cris.dai
 * Date: 12-8-16
 * Time: 10:23 AM
 */
var Utility = Utility || {};

(function () {
    "use strict";
    var dateUtil = (function () {
            var curTime;
            return {
                init: function () {
                    curTime = new Date();
                },
                setDay: function (days) {
                    this.init();
                    curTime.setTime(curTime.getTime() + days * 24 * 60 * 60 * 1000);
                },
                getDate: function () {
                    if (!curTime) {
                        this.init();
                    }
                    return curTime.toGMTString();
                }
            };
        }()),
        formatRE = /\{(\d+)\}/g,
        xmlHttpTypes = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],

        stringUtil = {
            format : function () {
                var args = Array.prototype.slice.call(arguments),
                    str = args.shift();
                return str.replace(formatRE, function (elem, index) {
                    return args[index];
                });
            }
        },
        cookieUtil = {
            stringFormat : stringUtil.format,
            cookieFormat: '{0}={1};expires={2};path={3};',
            setCookie : function (name, value, expireDays, path) {
                var days = expireDays && parseInt(expireDays, 10) > 0 ? parseInt(expireDays, 10) : 30; //默认值，此 cookie 将被保存 30 天
                path = path || '/';
                dateUtil.setDay(days);
                document.cookie = this.stringFormat(this.cookieFormat, name, encodeURIComponent(value), dateUtil.getDate(), path);
            },

            getCookie : function (name) {
                var arr = document.cookie.match(new RegExp(this.stringFormat("(^| ){0}=([^;]*)(;|$)",name)));
                if (arr !== null) {
                    return decodeURIComponent(arr[2]);
                }
                return null;
            },

            delCookie : function (name) {//删除cookie
                var exp = new Date(),
                    currentVal = this.getCookie(name);
                dateUtil.setDay(-1);
                if (currentVal !== null) {
                    document.cookie = this.stringFormat(this.cookieFormat, name, currentVal, dateUtil.getDate());
                }
            }
        },
        xhrUtil = {
            createXHR : function () {
                var xhr, i, xmlHttpType;
                if (self.XMLHttpRequest) {
                    xhr = new self.XMLHttpRequest();
                } else if (typeof self.ActiveXObject !== "undefined") {
                    for (i = 0; i < 3; i += 1) {
                        xmlHttpType = xmlHttpTypes[i];
                        try {
                            xhr = new self.ActiveXObject(xmlHttpType);
                        } catch (e) { }

                        if (xhr) {
                            break;
                        }
                    }
                }
                return xhr;
            },
            get : function (url, callback, errorCallback) {
                var xhr = this.createXHR();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function () {
                    var status, errorInfo;
                    if (xhr.readyState === 4) {
                        status = xhr.status;
                        if (status > 399 && status < 600) {
                            errorInfo = url + "error status: " + status;
                            if (errorCallback) {
                                errorCallback(errorInfo);
                            } else {
                                throw new Error(errorInfo);
                            }
                        } else {
                            callback(xhr.responseText);
                        }
                    }
                };
            }
        },
        consoleUtil = {
            log : function () {
                try {
                    console.log.apply(console, arguments);
                } catch (e) {
                    try {
                        opera.postError.apply(opera, arguments);//Tries to log the Opera way
                    } catch (ex) {
                        self.alert(Array.prototype.join.call(arguments));
                    }
                }
            },
            time : function (name, reset) {
                if (!name) { return; }
                var time = new Date().getTime(),
                    key = "KEY" + name.toString();
                if (!this.timeCounters) {
                    this.timeCounters = {};
                }
                if (!reset && this.timeCounters[key]) {
                    return;
                }
                this.timeCounters[key] = time;
            },
            timeEnd : function (name) {
                var time = new Date().getTime(),
                    key = "KEY" + name.toString(),
                    timeCounter = this.timeCounters[key],
                    diff = time - timeCounter,
                    label = stringUtil.format('{0} : {1} ms', name, diff);
                if (!this.timeCounters) {
                    return;
                }
                if (timeCounter) {
                    this.log(label);
                    delete this.timeCounters[key];
                }
                return diff;
            }
        };
    Utility.Ajax = xhrUtil;
    Utility.Cookies = cookieUtil;
    Utility.StringUtil = stringUtil;
    /*Implement the console for which is not support console*/
    Utility.Console = consoleUtil;
}());

