/**
* @package Code Craft
* @pdesc Conjunto de soluções front-end.
*
* @module DataBase
* @file JS DataBase.
*
* @author Rianna Cantarelli <rianna.aeon@gmail.com>
*/







// --------------------
// Caso não exista, inicia objeto CodeCraft
var CodeCraft = (CodeCraft || function () { });
if(typeof(CodeCraft) === 'function') { CodeCraft = new CodeCraft(); };






/**
* Permite criar uma simulação de um banco de dados simples.
*
* @class DataBase
*
* @memberof CodeCraft
*
* @static
*
* @type {Class}
*/
CodeCraft.DataBase = new (function () {
    var _bt = CodeCraft.BasicTools;








    /**
    * Representa uma tabela de dados.
    * 
    * @typedef {DataTable}
    *
    * @property {String}                        Name                                Nome da tabela de dados.
    * @property {DataTableColumn[]}             Columns                             Colunas de dados da tabela.
    * @property {Object[]}                      Rows                                Representa a coleção de dados da tabela.
    * @property {Integer}                       NextId                              Valor para o Id do próximo objeto inserido.
    */



    /**
    * Representa uma coluna de dados da tabela.
    * 
    * @typedef {DataTableColumn}
    *
    * @property {String}                        Name                                Nome da coluna.
    * @property {DataType}                      Type                                Tipo de dado aceito.
    * @property {Integer}                       Length = null                       Tamanho máximo de um campo do tipo String, Use "null" para um campo de tamanho ilimitado.
    * @property {Integer}                       Min = null                          Menor valor numérico que o campo pode ter.
    * @property {Integer}                       Max = null                          Maior valor numérico que o campo pode ter.
    * @property {String}                        RefType = null                      Quando a coluna é uma referência a objetos de outras tabelas, aqui, RefType é o nome da tabela.
    * @property {Boolean}                       AllowSet = true                     Indica que o valor pode ser setado pelo usuário [senão é o próprio objeto quem define seu valor].
    * @property {Boolean}                       AllowNull = true                    Indica se permite que o valor seja nulo [null].
    * @property {Boolean}                       AllowEmpty = false                  Indica se permite que o valor seja vazio [''].
    * @property {Boolean}                       Unique = false                      Indica que o valor desta coluna não pode ser repetido.
    * @property {Boolean}                       ReadOnly = false                    Indica que o valor só será setado 1 vez.
    * @property {String}                        Default = null                      Valor padrão para a propriedade.
    * @property {Function}                      Format = null                       Método para formatação do valor [executado após validação].
    */



    /**
    * Tipo de dados.
    * 
    * @deftype {DataType}
    *
    * @property {String}                        Name                                Nome do tipo.
    * @property {Function}                      Validate                            Função que efetua a validação do tipo.
    * @property {Function}                      TryParse                            Função que tenta converter o valor original para este tipo.
    */



    /**
    * Objeto padrão para o retorno dos dados de uma consulta.
    * 
    * @deftype {DataList}
    *
    * @property {Integer}                       TotalRows                           Total de registros na tabela pesquisada.
    * @property {Integer}                       ValidRows                           Total de registros válidos [a partir dos termos pesquisados].
    * @property {Integer}                       PageLength                          Número de registros retornados por página.
    * @property {Integer}                       TotalPages                          Total de páginas existêntes [levando em conta o tamanho da página]
    * @property {Integer}                       PageNumber                          Número da página retornada.
    * @property {Object[]}                      SelectedRows                        Array contendo os registros encontrados na página atual.
    */



    /**
    * Objeto de configuração de uma consulta.
    * 
    * @deftype {QueryFilter}
    *
    * @property {[Object|Function]}            Where                               Objeto ou função contendo as regras de identificação de objetos válidos.
    * @property {String}                       OrderBy = Id asc                    Nome da coluna que será usada para ordenar os dados e formato da ordenação asc|desc
    * @property {Integer}                      PageNumber = 1                      Número da página que será retornada.
    * @property {Integer}                      PageLength                          Número de objetos que devem ser retornados por página. Se não especificado, retornará todos.
    */


















    /*
    * PROPRIEDADES PRIVADAS
    */


    /**
    * Objeto que contem todas as tabelas de dados.
    *
    * @memberof DataBase
    *
    * @type {DataTable[]}
    */
    var _dataTables = [];



    /**
    * Coleção de tipos de dados.
    *
    * @type {DataType[]}
    */
    var _dataTypes = [
        {
            Name: 'Boolean',
            Validate: function (v) { return (typeof (v) === 'boolean') ? true : false; },
            TryParse: function (v) {
                if (typeof (v) === 'boolean') { return v; }
                else if (typeof (v) === 'string') {
                    switch (o.toLowerCase()) {
                        case 'true': case 'yes': case '1': case 'on': return true; break;
                        case 'false': case 'no': case '0': case 'off': return false; break;
                    }
                }

                return v;
            }
        },
        {
            Name: 'Byte',           // INTEGER 8 BITS
            Validate: function (v) { return _bt.IsInteger(v); },
            TryParse: function (v) { return _bt.TryParse.ToInteger(v); },
            Min: -128,
            Max: 127
        },
        {
            Name: 'Short',          // INTEGER 16 BITS
            Validate: function (v) { return _bt.IsInteger(v); },
            TryParse: function (v) { return _bt.TryParse.ToInteger(v); },
            Min: -32768,
            Max: 32767
        },
        {
            Name: 'Integer',        // INTEGER 32 BITS
            Validate: function (v) { return _bt.IsInteger(v); },
            TryParse: function (v) { return _bt.TryParse.ToInteger(v); },
            Min: -2147483648,
            Max: 2147483647
        },
        {
            Name: 'Long',           // INTEGER 64 BITS
            Validate: function (v) { return _bt.IsInteger(v); },
            TryParse: function (v) { return _bt.TryParse.ToInteger(v); },
            Min: -9223372036854775296, // -9223372036854775808
            Max: 9223372036854775296   //  9223372036854775807
        },
        {
            Name: 'Float',          // FLOAT 32 BITS
            Validate: function (v) { return _bt.IsNumber(v); },
            TryParse: function (v) { return _bt.TryParse.ToFloat(v); },
            Min: -2147483648,
            Max: 2147483647
        },
        {
            Name: 'Double',         // FLOAT 64 BITS
            Validate: function (v) { return _isNumber(v); },
            TryParse: function (v) { return _bt.TryParse.ToFloat(v); },
            Min: -9223372036854775296, // -9223372036854775808
            Max: 9223372036854775296   //  9223372036854775807
        },
        {
            Name: 'Date',
            Validate: function (v) { return (Object.prototype.toString.call(v) === '[object Date]') ? true : false; },
            TryParse: function (v) {
                if (Object.prototype.toString.call(v) === '[object Date]') { return v; }
                else if (typeof (v) === 'string') {
                    var d = new Date(v);
                    if (d && d.getFullYear() > 0) { return d; }
                }

                return v;
            }
        },
        {
            Name: 'String',
            Validate: function (v) { return (typeof (v) === 'string') ? true : false; },
            TryParse: function (v) {
                if (typeof (v) === 'string') { return v; }
                else if (Object.prototype.toString.call(v) === '[object Date]') {
                    var y = v.getFullYear().toString();
                    var M = (v.getMonth() + 1).toString();
                    var d = v.getDate().toString();
                    var H = v.getHours().toString();
                    var m = v.getMinutes().toString();
                    var s = v.getSeconds().toString();

                    // Adiciona 2 digitos a todas partes
                    M = (M.length == 1) ? '0' + M : M;
                    d = (d.length == 1) ? '0' + d : d;
                    H = (H.length == 1) ? '0' + H : H;
                    m = (m.length == 1) ? '0' + m : m;
                    s = (s.length == 1) ? '0' + s : s;

                    v = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
                }

                return v.toString();
            }
        },
        {
            Name: 'Object',
            Validate: function (v) { return (typeof (v) === 'object') ? true : false; },
            TryParse: function (v) { return v; }
        },
        {
            Name: 'Object[]',
            Validate: function (v) {
                var r = true;
                for (var it in v) {
                    if (typeof (v[it]) !== 'object') {
                        r = false;
                        break;
                    }
                }
                return r;
            },
            TryParse: function (v) { return v; }
        }
    ];




















    /*
    * MÉTODOS GERADORES DE OBJETOS
    */



    /**
    * Gera um novo objeto simulando uma tabela.
    * 
    * @function _createTable
    *
    * @private
    *
    * @param {String}                        parTable                            Nome da tabela de dados.
    *
    * @return {Boolean}
    */
    var _createTable = function (parTable) {

        _dataTables.push({
            Name: parTable,
            Columns: [],
            Rows: [],
            NextId: 1
        });


        var cId = _createDataTableColumn('Id', 'Integer', null, null, null, null, false, false, false, true, true, null, null);
        if (cId != null) {
            _alterTableSetColumn(parTable, cId);
            return true;
        }

        return false;
    };



    /**
    * Seleciona uma tabela de dados existente.
    * 
    * @function _selectTable
    *
    * @private
    *
    * @param {String}                        parTable                            Nome da tabela de dados.
    *
    * @return {!DataTable}
    */
    var _selectTable = function (parTable) {
        var r = null;

        for (var it in _dataTables) {
            var t = _dataTables[it];
            if (t.Name == parTable) {
                r = t;
            }
        }

        return r;
    };



    /**
    * Resgata o Id do último item adicionado.
    * 
    * @function _retrieveLastId
    *
    * @private
    *
    * @param {String}                        parTable                            Nome da tabela de dados.
    *
    * @return {!Integer}
    */
    var _retrieveLastId = function (parTable) {
        var r = null;

        var tab = _selectTable(parTable);
        if (tab.Rows.length > 0) {
            r = tab.Rows[tab.Rows.length - 1]['Id'];
        }

        return r;
    };



    /**
    * Adiciona configurações de uma coluna de dados para uma tabela existente.
    * 
    * @function _alterTableSetColumn
    *
    * @private
    *
    * @param {String}                        parTable                            Nome da tabela de dados.
    * @param {DataTableColumn}               parNewColumn                        Objeto de configuração da nova coluna de dados.
    *
    * @return {Boolean}
    */
    var _alterTableSetColumn = function (parTable, parNewColumn) {

        var r = false;

        var tab = _selectTable(parTable);
        if (tab != null) {
            // Verifica se o nome da coluna não está repetido
            var isNew = true;
            for (var c in tab.Columns) {
                if (tab.Columns[c].Name == parNewColumn.Name) { isNew = false; }
            }


            // Apenas se for uma nova coluna
            if (isNew) {
                tab.Columns.push(parNewColumn);
                r = true;
            }

        }

        return r;
    };



    /**
    * Cria um novo objeto "DataTableColumn".
    * 
    * @function _createDataTableColumn
    *
    * @private
    *
    * @param {String}                        parName                             Nome da coluna.
    * @param {DataType}                      parType                             Tipo de dado aceito.
    * @param {Integer}                       [parLength = null]                  Tamanho máximo para um campo do tipo String.
    * @param {Integer}                       [parMin = null]                     Valor mínimo aceito para um campo numérico.
    * @param {Integer}                       [parMax = null]                     Valor máximo aceito para um campo numérico.
    * @param {String}                        [parRefType = null]                 Nome da tabela de referência.
    * @param {Boolean}                       [parAllowSet = true]                Indica que o valor pode ser setado pelo usuário.
    * @param {Boolean}                       [parAllowNull = true]               Indica se permite que o valor seja nulo [null].
    * @param {Boolean}                       [parAllowEmpty = false]             Indica se permite que o valor seja vazio [''].
    * @param {Boolean}                       [parUnique = false]                 Indica que o valor desta coluna não pode ser repetido.
    * @param {Boolean}                       [parReadOnly = false]               Indica que o valor só será setado 1 vez.
    * @param {String}                        [parDefault = null]                 Valor padrão para a propriedade.
    * @param {Function}                      [parFormat = null]                  Método para formatação do valor [executado após validação].
    *
    * @return {!DataTableColumn}
    */
    var _createDataTableColumn = function (parName, parType, parLength, parMin, parMax, parRefType,
                                        parAllowSet, parAllowNull, parAllowEmpty, parUnique, parReadOnly, parDefault, parFormat) {
        var Type = null;


        for (var it in _dataTypes) {
            if (_dataTypes[it].Name == parType) {
                Type = _dataTypes[it];
            }
        }



        if (Type != null) {
            parLength = _bt.InitiSet(parLength, null, true);
            parMin = _bt.InitiSet(parMin, null, true);
            parMax = _bt.InitiSet(parMax, null, true);

            parRefType = _bt.InitiSet(parRefType, null, true);
            parAllowSet = _bt.InitiSet(parAllowSet, true, true);
            parAllowNull = _bt.InitiSet(parAllowNull, true, true);
            parAllowEmpty = _bt.InitiSet(parAllowEmpty, false, true);
            parUnique = _bt.InitiSet(parUnique, false, true);
            parReadOnly = _bt.InitiSet(parReadOnly, false, true);
            parDefault = _bt.InitiSet(parDefault, null, true);
            parFormat = _bt.InitiSet(parFormat, null, true);


            // Tratamentos especiais conforme o tipo...
            switch (Type.Name) {
                case 'Boolean':
                case 'Object':
                case 'Object[]':
                    parLength = null;
                    parMin = null;
                    parMax = null;

                    if (Type.Name == 'Object[]' && !_bt.IsNotNullValue(parDefault)) { parDefault = []; }

                    break;

                case 'String':
                    parMin = null;
                    parMax = null;
                    break;

                case 'Byte':
                case 'Short':
                case 'Integer':
                case 'Long':
                case 'Float':
                case 'Double':
                    parLength = null;
                    parMin = (parMin != null && parMin >= Type.Min) ? parMin : Type.Min;
                    parMax = (parMax != null && parMax <= Type.Max) ? parMax : Type.Max;

                    break;
            }


            return {
                Name: parName,
                Type: Type,
                Length: parLength,
                Min: parMin,
                Max: parMax,
                RefType: parRefType,
                AllowSet: parAllowSet,
                AllowNull: parAllowNull,
                AllowEmpty: parAllowEmpty,
                Unique: parUnique,
                ReadOnly: parReadOnly,
                Default: parDefault,
                Format: parFormat
            };
        }


        return null;
    };



    /**
    * Verifica se o valor informado é compatível com as regras de configuração para a coluna.
    * Retorna "undefined" caso o valor seja inválido, ou retorna o próprio valor devidamente formatado.
    * 
    * @function _checkColRules
    *
    * @private
    *
    * @param {Object}                        val                                 Valor que será testado.
    * @param {DataTableColumn}               cRule                               Regras para a coluna de dados.
    * @param {DataTable}                     tab                                 Tabela de dados dona da coluna que será verificada.
    *
    * @return {[undefined|Object]}
    */
    var _checkColRules = function (val, cRule, tab) {
        isOK = true;


        // Se não é permitido o set desta coluna...
        if (cRule.AllowSet) {

            // Corrige valores nulos para quando há um valor padrão.
            if (val == undefined || val == null) {
                val = cRule.Default;

                // Verifica tratamento especial para formato Date
                if (cRule.Type.Name === 'Date' && cRule.Default === 'new') {
                    val = new Date();
                }
            }


            // Se for um valor considerado vazio, nulo ou indefinido
            if (!_bt.IsNotNullValue(val)) {
                if ((val == null && cRule.AllowNull == false) || (val == '' && cRule.AllowEmpty == false)) { isOK = false; }
            }
            // Senão, se há um valor setado...
            else {
                // Verifica o formato do valor indicado
                val = cRule.Type.TryParse(val);

                // Valida o valor conforme o tipo de dado da coluna
                isOK = cRule.Type.Validate(val);
                if (isOK) {
                    // Formata o valor
                    val = (cRule.Format != null) ? cRule.Format(val) : val;


                    switch (cRule.Type.Name) {
                        // Se for uma string, verifica tamanho da mesma.                
                        case 'String':
                            if (cRule.Length != null && val.length > cRule.Length) {
                                isOK = false;
                            }

                            break;

                        // Se for um número, verifica se o valor informado está dentro do range.                
                        case 'Byte':
                        case 'Short':
                        case 'Integer':
                        case 'Long':
                        case 'Float':
                        case 'Double':
                            if (val < cRule.Type.Min || val > cRule.Type.Max) {
                                isOK = false;
                            }

                            break;
                    }



                    // Verifica regra de valor único
                    if (isOK && cRule.Unique) {
                        for (var r in tab.Rows) {
                            if (tab.Rows[r][cRule.Name] == val) { isOK = false; break; }
                        }
                    }

                }

            }
        }


        return (isOK) ? val : undefined;
    };



    /**
    * Corrige sets de um objeto "QueryFilter".
    * 
    * @function _ajustQueryFilter
    *
    * @private
    *
    * @param {QueryFilter}                  filter                          Objeto que será verificado.
    *
    * @return {QueryFilter}
    */
    var _ajustQueryFilter = function (filter) {
        var model = {
            Where: null,
            OrderBy: 'Id asc',
            PageNumber: 1,
            PageLength: null
        };


        if (!_bt.IsNotNullValue(filter)) { filter = model; }
        else {
            filter['Where'] = _bt.InitiSet(filter['Where'], model.Where);
            filter['OrderBy'] = _bt.InitiSet(filter['OrderBy'], model.OrderBy);
            filter['PageNumber'] = _bt.InitiSet(filter['PageNumber'], model.PageNumber);
            filter['PageLength'] = _bt.InitiSet(filter['PageLength'], model.PageLength);
        }


        return filter;
    };


















    /**
    * OBJETO PÚBLICO QUE SERÁ EXPOSTO.
    */
    var public = this.Control = {
        /**
        * Reinicia o objeto eliminando totalmente as tabelas e seus dados.
        * 
        * @function ResetDataBase
        *
        * @memberof DataBase
        */
        ResetDataBase: function () {
            _dataTables = [];
        },





        /**
        * Retorna um objeto clone do banco de dados atual.
        * 
        * @function RetrieveDataBase
        *
        * @memberof DataBase
        *
        * @return {DataTable[]}
        */
        RetrieveDataBase: function () {
            return _bt.CloneObject(_dataTables);
        },





        /**
        * Gera um novo objeto simulando uma tabela.
        * 
        * @function CreateTable
        *
        * @memberof DataBase
        *
        * @param {String}                        parTable                            Nome da tabela de dados.
        * @param {DataTableColumn[]}             parColumns                          Configurações para as colunas de dados.
        *
        * @return {Boolean}
        */
        CreateTable: function (parTable, parConfig) {

            var r = false;

            // Apenas se a tabela ainda não existir e for corretamente criada...
            if (_selectTable(parTable) == null) {
                if (_createTable(parTable)) {
                    r = true;

                    for (var it in parConfig) {
                        var c = parConfig[it];
                        var nCol = _createDataTableColumn(c.Name, c.Type, c.Length, c.Min, c.Max, c.RefType,
                                                          c.AllowSet, c.AllowNull, c.AllowEmpty, c.Unique, c.ReadOnly, c.Default, c.Format);

                        if (nCol != null) {
                            r = _alterTableSetColumn(parTable, nCol);
                            if (!r) { break; }
                        }
                        else {
                            break;
                        }

                    }

                }
            }

            return r;
        },





        /**
        * Cria um novo objeto "DataTableColumn".
        * 
        * @function CreateDataTableColumn
        *
        * @memberof DataBase
        *
        * @param {String}                        parName                             Nome da coluna.
        * @param {DataType}                      parType                             Tipo de dado aceito.
        * @param {Integer}                       [parLength = null]                  Tamanho máximo para um campo do tipo String.
        * @param {Integer}                       [parMin = null]                     Valor mínimo aceito para um campo numérico.
        * @param {Integer}                       [parMax = null]                     Valor máximo aceito para um campo numérico.
        * @param {String}                        [parRefType = null]                 Nome da tabela de referência.
        * @param {Boolean}                       [parAllowSet = true]                Indica que o valor pode ser setado pelo usuário.
        * @param {Boolean}                       [parAllowNull = true]               Indica se permite que o valor seja nulo [null].
        * @param {Boolean}                       [parAllowEmpty = false]             Indica se permite que o valor seja vazio [''].
        * @param {Boolean}                       [parUnique = false]                 Indica que o valor desta coluna não pode ser repetido.
        * @param {Boolean}                       [parReadOnly = false]               Indica que o valor só será setado 1 vez.
        * @param {String}                        [parDefault = null]                 Valor padrão para a propriedade.
        * @param {Function}                      [parFormat = null]                  Método para formatação do valor [executado após validação].
        *
        * @return {!DataTableColumn}
        */
        CreateDataTableColumn: function (parName, parType, parLength, parMin, parMax, parRefType,
                                            parAllowSet, parAllowNull, parAllowEmpty, parUnique, parReadOnly, parDefault, parFormat) {
            return _createDataTableColumn(parName, parType, parLength, parMin, parMax, parRefType,
                                            parAllowSet, parAllowNull, parAllowEmpty, parUnique, parReadOnly, parDefault, parFormat);
        },




        /**
        * Conta quantos registros existem em uma determinada tabela.
        * 
        * @function Count
        *
        * @memberof DataBase
        *
        * @param {String}                       parTable                        Nome da tabela de dados.
        *
        * @return {Integer}
        */
        Count: function (parTable) {

            var r = 0;

            // Se a tabela existir
            var tab = _selectTable(parTable);
            if (tab != null) {
                r = tab.Rows.length;
            }

            return r;
        },





        /**
        * Indica se o objeto existe ou não na tabela de dados indicada a partir de seu Id.
        * 
        * @function HasObject
        *
        * @memberof DataBase
        *
        * @param {String}                       parTable                        Nome da tabela de dados.
        * @param {Integer}                      Id                              Id da linha de dados que será verificada.
        *
        * @return {Boolean}
        */
        HasObject: function (parTable, Id) {

            var r = false;

            // Se a tabela existir
            var tab = _selectTable(parTable);
            if (tab != null) {
                for (var it in tab.Rows) {
                    if (tab.Rows[it]['Id'] == Id) {
                        r = true;
                        break;
                    }
                }
            }

            return r;
        },





        /**
        * Insere uma nova linha de dados em uma tabela.
        * 
        * @function InsertInto
        *
        * @memberof DataBase
        *
        * @param {String}                       parTable                        Nome da tabela de dados.
        * @param {JSON}                         rowData                         Dados que serão adicionados.
        *
        * @return {Boolean}
        */
        InsertInto: function (parTable, rowData) {
            var r = false;

            // Se a tabela existir
            var tab = _selectTable(parTable);
            if (tab != null) {

                var newRow = {};
                var countOK = 0;


                // Para cada coluna de dados configurada na tabela atual...
                for (var tC in tab.Columns) {
                    var cRule = tab.Columns[tC];
                    var val = _bt.CloneObject(rowData[cRule.Name]);


                    // Caso seja a coluna Id
                    if (cRule.Name == 'Id') {
                        newRow[cRule.Name] = tab.NextId;
                        countOK++;
                    }
                    else {
                        if (!cRule.AllowSet) {
                            newRow[cRule.Name] = null;
                            countOK++;
                        }
                        else {
                            
                            // Conforme a natureza da coluna de dados...
                            switch (cRule.Type.Name) {
                                case 'Object':
                                    val = CodeCraft.DataBase.SaveOrUpdate(cRule.RefType, val);
                                    break;

                                case 'Object[]':

                                    if (typeof (val) !== '[object Array]') {
                                        val = [];
                                    }
                                    else {
                                        var nVal = [];
                                        var isOK = true;

                                        // Enquanto não houver erros, processa objetos filhos...
                                        for (var it in val) {
                                            if (isOK) {
                                                var nO = CodeCraft.DataBase.SaveOrUpdate(cRule.RefType, val[it]);

                                                if (nO === null) { isOK = false; }
                                                else { nVal.push(nO); }
                                            }
                                        }

                                        // Havendo qualquer erro, remove todos os objetos adicionados
                                        // e o insert como um todo falhará.
                                        if (!isOK) {
                                            nVal = undefined;
                                            for (var it in nVal) {
                                                CodeCraft.DataBase.DeleteFrom(cRule.RefType, nVal[it]['Id']);
                                            }
                                        }

                                        val = nVal;
                                    }


                                    break;

                                default:
                                    val = _checkColRules(val, cRule, tab);
                                    break;
                            }


                            // Efetua sets
                            if (val !== undefined) {
                                newRow[cRule.Name] = val;
                                countOK++;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }



                if (countOK == tab.Columns.length) {
                    tab.Rows.push(newRow);
                    tab.NextId++;

                    
                    rowData['Id'] = newRow['Id'];

                    r = true;
                }
            }


            return r;
        },





        /**
        * Atualiza uma linha de dados em uma tabela.
        * 
        * @function UpdateSet
        *
        * @memberof DataBase
        *
        * @param {String}                       parTable                        Nome da tabela de dados.
        * @param {JSON}                         rowData                         Dados que serão atualizados.
        *
        * @return {Boolean}
        */
        UpdateSet: function (parTable, rowData) {

            var r = false;


            // Apenas se há um Id definido
            if (rowData['Id'] !== undefined) {
                var Id = rowData['Id'];

                // Se a tabela existir
                var tab = _selectTable(parTable);
                if (tab != null) {


                    // Se o registro existir, resgata sua posição no array
                    var iRow = null;
                    for (var it in tab.Rows) {
                        if (tab.Rows[it]['Id'] == Id) { iRow = it; break; }
                    }


                    if (iRow != null) {
                        var newRow = {};
                        var countOK = 0;

                        // Para cada coluna de dados configurada na tabela atual...
                        for (var tC in tab.Columns) {
                            var cRule = tab.Columns[tC];
                            var val = rowData[cRule.Name];

                            // Identifica se o valor pode ou não ser definido
                            var isSet = ((cRule.AllowSet && (!cRule.ReadOnly || (val === null && cRule.ReadOnly))));


                            if (isSet) {

                                // Conforme a natureza da coluna de dados...
                                switch (cRule.Type.Name) {
                                    case 'Object':
                                        val = CodeCraft.DataBase.SaveOrUpdate(cRule.RefType, val);
                                        break;

                                    case 'Object[]':

                                        if (typeof (val) !== '[object Array]') {
                                            val = [];
                                        }
                                        else {
                                            var nVal = [];
                                            var isOK = true;

                                            // Enquanto não houver erros, processa objetos filhos...
                                            for (var it in val) {
                                                if (isOK) {
                                                    var nO = CodeCraft.DataBase.SaveOrUpdate(cRule.RefType, val[it]);

                                                    if (nO === null) { isOK = false; }
                                                    else { nVal.push(nO); }
                                                }
                                            }

                                            // Havendo qualquer erro, remove todos os objetos adicionados
                                            // e o insert como um todo falhará.
                                            if (!isOK) {
                                                nVal = undefined;
                                                for (var it in nVal) {
                                                    CodeCraft.DataBase.DeleteFrom(cRule.RefType, nVal[it]['Id']);
                                                }
                                            }

                                            val = nVal;
                                        }


                                        break;

                                    default:
                                        val = _checkColRules(val, cRule, tab);
                                        break;
                                }



                                // Efetua sets
                                if (val !== undefined) {
                                    newRow[cRule.Name] = val;
                                    countOK++;
                                }
                                else {
                                    break;
                                }
                            }
                            else {
                                newRow[cRule.Name] = tab.Rows[iRow][cRule.Name];
                                countOK++;
                            }
                        }



                        // Se todos os dados foram corretamente setados...
                        if (countOK == tab.Columns.length) {
                            tab.Rows[iRow] = newRow;
                            r = true;
                        }
                    }
                }

            }


            return r;
        },





        /**
        * Efetua a persistência ou a atualização de um objeto e retorna seu valor final caso
        * o procedimento tenha ocorrido com sucesso.
        * 
        * @function SaveOrUpdate
        *
        * @memberof DataBase
        *
        * @param {String}                       parTable                        Nome da tabela de dados.
        * @param {JSON}                         rowData                         Dados que serão adicionados.
        *
        * @return {!Object}
        */
        SaveOrUpdate: function (parTable, rowData) {
            var o = null;

            if (_bt.IsNotNullValue(rowData)) {
                o = undefined;

                // Se trata-se de um novo item, adiciona-o
                if (rowData['Id'] === undefined) {

                    if (CodeCraft.DataBase.InsertInto(parTable, rowData)) {
                        o = CodeCraft.DataBase.SelectObject(parTable, _retrieveLastId(parTable));
                    }
                }
                // Senão, atualiza o objeto.
                else {
                    if (CodeCraft.DataBase.UpdateSet(parTable, rowData)) {
                        o = CodeCraft.DataBase.SelectObject(parTable, rowData['Id']);
                    }
                }
            }

            return o;
        },




        /**
        * Remove uma linha de dados de uma tabela.
        * 
        * @function DeleteFrom
        *
        * @memberof DataBase
        *
        * @param {String}                       parTable                        Nome da tabela de dados.
        * @param {Integer}                      Id                              Id da linha de dados que será removida.
        *
        * @return {Boolean}
        */
        DeleteFrom: function (parTable, Id) {

            var r = null;

            // Se a tabela existir
            var tab = _selectTable(parTable);
            if (tab != null) {
                var i = -1;

                for (var it in tab.Rows) {
                    if (tab.Rows[it]['Id'] == Id) {
                        i = it;
                    }
                }

                if (i > -1) {
                    tab.Rows.splice(i, 1);
                }
            }

            return r;
        },





        /**
        * Seleciona e retorn uma linha de dados da tabela alvo.
        * 
        * @function SelectObject
        *
        * @memberof DataBase
        *
        * @param {String}                       parTable                        Nome da tabela de dados.
        * @param {Integer}                      Id                              Id da linha de dados que será retornada.
        *
        * @return {!Object}
        */
        SelectObject: function (parTable, Id) {

            var r = null;
            var o = null;

            // Se a tabela existir
            var tab = _selectTable(parTable);
            if (tab != null) {
                for (var it in tab.Rows) {
                    if (tab.Rows[it]['Id'] == Id) {
                        o = tab.Rows[it];
                        break;
                    }
                }
            }


            if (o != null) {
                r = _bt.CloneObject(o);
            }

            return r;
        },





        /**
        * Seleciona uma lista com todos os objetos que entrarem nas definições de filtragem indicadas.
        * 
        * @function SelectObjectList
        *
        * @memberof DataBase
        *
        * @param {String}                       parTable                        Nome da tabela de dados.
        * @param {QueryFilter}                  [filter]                        Configurações para o retorno dos dados.
        *
        * @return {Object[]}
        */
        SelectObjectList: function (parTable, filter) {
            var o = {
                TotalRows: 0,
                ValidRows: 0,
                PageLength: 0,
                TotalPages: 0,
                PageNumber: 0,
                SelectedRows: []
            };


            // Se a tabela existir
            var tab = _selectTable(parTable);
            if (tab != null) {
                // Resgata referência das tabelas atualmente válidas
                var useRows = tab.Rows;
                var tRows = CodeCraft.DataBase.Count(parTable);


                // Verifica sets do filtro
                filter = _ajustQueryFilter(filter);
                filter.PageLength = (filter.PageLength === null) ? tRows : filter.PageLength;


                // Atualiza o objeto de retorno
                o = {
                    TotalRows: tRows,
                    ValidRows: tRows,
                    PageLength: filter.PageLength,
                    TotalPages: 0,
                    PageNumber: filter.PageNumber,
                    SelectedRows: []
                };




                // Se foi definida uma clausula where
                if (_bt.IsNotNullValue(filter.Where)) {

                    // Se for uma função, evoca-a para que o filtro seja aplicado
                    if (typeof (filter.Where) === 'function') {
                        useRows = filter.Where(tab.Rows);
                    }
                    // Senão, efetua verificação simples
                    else if (typeof (filter.Where) === 'object') {
                        useRows = [];

                        for (var key in filter.Where) {
                            var val = filter.Where[key];


                            for (var it in tab.Rows) {
                                if (tab.Rows[it][key] === val) {
                                    useRows.push(tab.Rows[it]);
                                }
                            }

                        }
                    }
                }
                o.ValidRows = useRows.length;



                // Aplica ordenação caso ela tenha sido definida.
                if (filter.OrderBy != 'Id asc') {

                    var order = filter.OrderBy.split(' ');

                    if (order.length == 2) {
                        order[1] = order[1].toLowerCase();

                        if (order[1] == 'asc' || order[1] == 'desc') {
                            // Identifica o tipo da coluna
                            var tp = null;
                            for (var it in tab.Columns) {
                                if (tab.Columns[it].Name == order[0]) {
                                    tp = tab.Columns[it].Type.Name;
                                    break;
                                }
                            }

                            useRows.sort(_bt.DynamicSort(order[0], order[1], tp));
                        }
                    }
                }




                // Calcula o total de páginas
                o.TotalPages = parseInt(o.ValidRows / o.PageLength);
                if (o.ValidRows % o.PageLength != 0) { o.TotalPages++; }



                // Verifica o indice do início do get
                var iStart = (o.PageNumber * o.PageLength) - o.PageLength;
                var iEnd = iStart + o.PageLength;


                if (iStart <= o.ValidRows - 1) {
                    for (var i = iStart; i < iEnd; i++) {
                        if (i <= o.ValidRows - 1) {
                            o.SelectedRows.push(_bt.CloneObject(useRows[i]));
                        }
                    }
                }
            }




            return o;
        }
    };










    return public;
});