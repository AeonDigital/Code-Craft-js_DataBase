 Code Craft - DataBase
======================

> [Aeon Digital](http://www.aeondigital.com.br)
>
> rianna@aeondigital.com.br


**Code Craft** é um conjunto de soluções front-end e outras server-side para a construção de aplicações web.
Tais soluções aqui apresentadas são a minha forma de compartilhar com a `comunidade online` parte do que aprendi 
(e continuo aprendendo) nos foruns, sites, blogs, livros e etc. assim como na experiência adquirida no contato
direto com profissionais e estudantes que, como eu, amam o universo `Web Developer` e nunca se dão por satisfeitos 
com seu nível atual de conhecimento.


## C.C. - DataBase

**DataBase** provê um simples simulacro de um banco de dados com suporte a tipos, validação e formatação dos 
mesmos.



### Métodos.

* `ResetDataBase`               : Reinicia o objeto eliminando totalmente as tabelas e seus dados.
* `RetrieveDataBase`            : Retorna um objeto clone do banco de dados atual.
* `GetLastError`                : Resgata os erros ocorridos no último processamento feito.
* `CreateTable`                 : Gera um novo objeto simulando uma tabela.
* `CreateDataTableColumn`       : Cria um novo objeto "DataTableColumn".
* `Count`                       : Conta quantos registros existem em uma determinada tabela.
* `HasObject`                   : Indica se o objeto existe ou não na tabela de dados indicada a partir de seu Id.
* `InsertInto`                  : Insere uma nova linha de dados em uma tabela.
* `UpdateSet`                   : Atualiza uma linha de dados em uma tabela.
* `SaveOrUpdate`                : Insere ou atualiza uma linha de dados em uma tabela.
* `DeleteFrom`                  : Remove uma linha de dados de uma tabela.
* `SelectObject`                : Seleciona e retorn uma linha de dados da tabela alvo.
* `SelectObjectList`            : Seleciona várias linhas de dados da tabela alvo.


**Importante**

Tenha em mente que em algumas vezes, neste e em outros projetos **Code Craft** optou-se de forma consciênte em 
não utilizar uma ou outra *regra de otimização* dos artefatos de software quando foi percebida uma maior vantagem para
a equipe de desenvolvimento em flexibilizar tal ponto do que extritamente seguir todas as regras de otimização.


### Compatibilidade

Não é intenção deste nem de outros projetos do conjunto de soluções **Code Craft** em manter 
compatibilidade com navegadores antigos (IE8<).


________________________________________________________________________________________________________________________



## Licença

Para este e outros projetos **Code Craft** é utilizada a [Licença GNUv3](LICENCE.md).
