const navigationData = {
    id: 'currencies-navigation',
    label: "Currencies",
    view: "currencies",
    group: "configurations",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-currencies/gen/codbex-currencies/ui/Currencies/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }