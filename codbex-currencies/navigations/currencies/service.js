const navigationData = {
    id: 'currencies-navigation',
    label: "Currencies",
    group: "reference-data",
    order: 200,
    link: "/services/web/codbex-currencies/gen/codbex-currencies/ui/Currencies/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }