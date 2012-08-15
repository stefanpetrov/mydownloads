
AUTHORS
=======

 * Stefan Petrov @ <http://stefanpetrov.net/>
 * Jimmy Berry ("boombatower", http://drupal.org/user/214218)

README.txt
==========

Модула MyDownloads зависи от Session API, който се ползва за управление на анонимните потребители.

След първоначалната инстлация направете настройките на admin/mydownloads, като зададатете поле,
което ще активира модула за конкретния нод.

Блока с лист с избраните файлове се генерира автоматично от модула и може да бъде управляван от admin/structure/block.
За предпочитане е не се показва в пътя /mydownloads

За интеграция във Views е необходимо да включите поле с Node ID, да генерирате View style темплейт файл и
да добавите на подходящото място фунцкията

print theme('mydownloads_link', array('node' => $node));

където $node е обект.