var SimplePanel = function($panel, continentsPromise, onClickContinentCb) {
    continentsPromise.then(function(continents) {
        var buttonsHTML = continents.map(function(continent) {
            return continent === 'Europe' ? '<li class="active">'+ continent +'</li>' : '<li>'+ continent +'</li>';
        });

        buttonsHTML.push('<li data-all="true">All continents</li>')

        var $buttonsGroup = $panel.find('.buttons-group');

        $buttonsGroup.append(buttonsHTML.join(''));

        $buttonsGroup.on('click', 'li', function(evt) {

            $buttonsGroup.find('li').removeClass('active');
            var $el = $(evt.currentTarget);
            $el.addClass('active');
            onClickContinentCb($el.attr('data-all') ? false : $el.text());
        });
    });
};


if (!window.module) {
    window.SimplePanel = SimplePanel;
} else {
    module.exports = SimplePanel;
}