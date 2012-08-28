/*global document*/
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
            cookieFormat: '{0}={1};expires={2};',
            setCookie : function (name, value, expireDays) {
                var days = expireDays && parseInt(expireDays, 10) > 0 ? parseInt(expireDays, 10) : 30; //默认值，此 cookie 将被保存 30 天
                dateUtil.setDay(days);
                document.cookie = this.stringFormat(this.cookieFormat, name, encodeURIComponent(value), dateUtil.getDate());
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
        };
    Utility.Cookies = cookieUtil;
    Utility.StringUtil = stringUtil;
}());

