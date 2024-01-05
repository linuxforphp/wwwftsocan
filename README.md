# [![LightMVC Banner](https://github.com/lightmvc/lightmvcskel/raw/master/public/img/lightmvc_logo.png)](https://lightmvcframework.net/)
# LightMVC Framework Skeleton Application

https://lightmvcframework.net

Easily create PHP applications by using any PHP library within this very modular, event-driven and Swoole-enabled framework!

## HOWTO

You can use the **LightMVC Skeleton Application** by issuing these commands:

    $ git clone https://github.com/lightmvc/lightmvcskel
    $ cd lightmvcskel
    $ composer install

> The LightMVC Skeleton Application can also be downloaded as an archive file from the https://lightmvcframework.net/download.

Once the previous step is done:

* Add a virtual host definition in the Apache configuration file.
* Add your database configuration to config/config.local.php,
* Load the included test database data/db_schema.sql and data/db_data.sql,
* Load the application in your favorite browser.

> Please make sure that the server can write to the cache/, logs/ and templates_c/ folders!

The **LightMVC Framework Skeleton Application** can also run on Swoole in order to make it lightning fast. In order
to do so, you must make sure to install Swoole. From the CLI, as the root user, type the following:

    $ pecl install swoole

After answering a few questions, Swoole will be compiled and installed. Then, run the following command (on Linux/Unix/Mac):

    $ echo "extension=swoole.so" >> /etc/php.ini

> If running **Swoole** on **Windows**, please add the extension manually in **PHP**'s ``php.ini`` file. The ``php.ini`` file might be located elsewhere on your system. For example, on **Ubuntu** 18.04, when running **PHP** 7.2, you will find this file in ``/etc/php/7.2/apache2``. You can discover the location of this file by entering the command ``php --ini`` on the command line. It must also be mentioned that some systems have multiple INI files (CLI vs Web). Please modify all those that apply.

Then, from within the root directory of the project, you can run the following command:

    $ COMPOSER_PROCESS_TIMEOUT=0 composer run-swoole

> By default, Swoole will listen on the ``localhost`` loopback, on port 9501. If you wish to change this, please modify the ``run-swoole`` command inside the ``composer.json`` file according to your needs.

## Upgrading from 4.0.0 to 5.0.0

When upgrading from version 4.0.0 to 5.0.0, please make sure to replace the namespace \Doctrine\Common with \Ascmvc\Session\Common in your config/session.config.php file.

### Have a lot of fun! :)