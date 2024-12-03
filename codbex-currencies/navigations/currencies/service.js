const navigationData = {
    id: 'currencies-navigation',
    label: "Currencies",
    view: "currencies",
    group: "reference-data",
    orderNumber: 200,
    link: "/services/web/codbex-currencies/gen/codbex-currencies/ui/Currencies/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }