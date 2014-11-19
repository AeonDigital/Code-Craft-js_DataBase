/**
* @package Code Craft
* @pdesc Conjunto de soluções front-end.
*
* @module DataBase
* @file JS DataBase.
*
* @requires BasicTools
* @requires ComplexType
*
* @author Rianna Cantarelli <rianna.aeon@gmail.com>
*/
'use strict';




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
    var _ct = CodeCraft.ComplexType;








    /**
    * Representa uma tabela de dados.
    * 
    * @typedef {DataTable}
    *
    * @property {String}                        Name                                Nome da tabela de dados.
    * @property {ComplexType[]}                 Columns                             Coleção das regras de cada coluna da tabela de dados.
    * @property {Object[]}                      Rows                                Representa a coleção de dados da tabela.
    * @property {Integer}                       NextId                              Valor para o Id do próximo objeto inserido.
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
    * @private
    *
    * @type {DataTable[]}
    */
    var _dataTables = [];




















    /*
    * TRATAMENTO DE ERROS
    */



    /**
    * Objeto de registro de erro.
    * 
    * @typedef {DataBaseError}
    *
    * @property {String}                        DataBaseError                       Tipo do erro.
    * @property {String}                        Message                             Mensagem de erro.
    * @property {Integer}                       ProcessId                           Id de um processo.
    */



    /**
    * Tipos de erros.
    *
    * @memberof DataBase
    *
    * @enum DataBaseError
    *
    * @type {String}
    *
    * @readonly
    */
    var DataBaseError = {
        /** 
        * Tabela já existente. 
        *
        * @memberof DataBaseError
        */
        TableAlreadyExists: 'TableAlreadyExists',
        /** 
        * Tabela não existe. 
        *
        * @memberof DataBaseError
        */
        TableDoesNotExist: 'TableDoesNotExist',
        /** 
        * Coluna já existente. 
        *
        * @memberof DataBaseError
        */
        ColumnAlreadyExists: 'ColumnAlreadyExists',
        /** 
        * Objeto passado é invalido ou nulo. 
        *
        * @memberof DataBaseError
        */
        InvalidOrNullDataObject: 'InvalidOrNullDataObject',
        /** 
        * O valor passado foi considerado inválido. 
        *
        * @memberof DataBaseError
        */
        InvalidValue: 'InvalidValue',
        /** 
        * Valores nulos não são aceitos. 
        *
        * @memberof DataBaseError
        */
        DoesNotAcceptNullValues: 'DoesNotAcceptNullValues',
        /** 
        * Tamanho máximo da string foi atinjido. 
        *
        * @memberof DataBaseError
        */
        MaxLengthExceeded: 'MaxLengthExceeded',
        /** 
        * Valor fora da faixa permitida. 
        *
        * @memberof DataBaseError
        */
        OutOfRange: 'OutOfRange',
        /** 
        * Regra de valor único foi violada. 
        *
        * @memberof DataBaseError
        */
        UniqueConstraintViolated: 'UniqueConstraintViolated',
        /** 
        * Tabela já existente. 
        *
        * @memberof DataBaseError
        */
        InvalidType: 'InvalidType'
    }



    /**
    * ID do próximo processo de erro.
    *
    * @memberof DataBase
    *
    * @private
    *
    * @type {Integer}
    */
    var _nextProcessId = 0;



    /**
    * Registra uma falha no log.
    * 
    * @function _registerError
    *
    * @private
    *
    * @param {DataBaseError}                 parDataBaseError                       Tipo do erro.
    * @param {String}                        parMessage                             Mensagem de erro.
    *
    * @return {Boolean}
    */
    var _registerError = function (parDataBaseError, parMessage) {
        console.log('[' + _nextProcessId + '] ' + parDataBaseError + ' : ' + parMessage);
    };




















    /*
    * MÉTODOS PRIVADOS
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

        return true;
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
    * @param {ComplexType}                   parNewColumn                        Objeto de configuração da nova coluna de dados.
    *
    * @return {Boolean}
    */
    var _alterTableSetColumn = function (parTable, parNewColumn) {

        var r = false;

        var tab = _selectTable(parTable);
        if (tab == null) {
            _registerError(DataBaseError.TableDoesNotExist, 'Table "' + parTable + '" Does Not Exist.');
        }
        else {
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
            else {
                _registerError(DataBaseError.ColumnAlreadyExists, 'Column "' + parNewColumn.Name + '" Already Exist In Table "' + parTable + '".');
            }
        }

        return r;
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
    var _public = this.Control = {
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
        * A partir do nome de uma tabela e de sua coluna, retorna seu objeto "ComplexType".
        * 
        * @function RetrieveComplexType
        *
        * @memberof DataBase
        *
        * @param {String}                        parTable                            Nome da tabela.
        * @param {String}                        parColumn                           Nome da coluna.
        *
        * @return {!ComplexType}
        */
        RetrieveComplexType: function (parTable, parColumn) {
            var tab = _selectTable(parTable);
            var r = null;

            if (tab == null) {
                console.log('Reference for invalid TableName "' + parTable + '".');
            }
            else {
                for (var it in tab.Columns) {
                    if (tab.Columns[it].Name == parColumn) {
                        r = tab.Columns[it];
                    }
                }

                if (!_bt.IsNotNullValue(r)) {
                    console.log('Reference for invalid ColumnName "' + parColumn + '".');
                }
            }

            return r;
        },




        /**
        * Gera um novo objeto simulando uma tabela.
        * 
        * @function CreateTable
        *
        * @memberof DataBase
        *
        * @param {String}                        parTable                            Nome da tabela de dados.
        * @param {ComplexType[]}                 parConfig                           Configurações para as colunas de dados.
        *
        * @return {Boolean}
        */
        CreateTable: function (parTable, parConfig) {

            var r = false;

            // Verifica existência de uma tabela com mesmo nome
            if (_selectTable(parTable) != null) {
                _registerError(DataBaseError.TableAlreadyExists, 'Table "' + parTable + '" Already Exist.');
            }
            else {
                if (_createTable(parTable)) {
                    r = true;
                    var newCols = [];

                    // Gera a coluna de ID da tabela
                    var cId = _ct.CreateNewType('Id', 'Integer', null, null, null, null,
                                                false, false, false, true, true, null, null, null);


                    // Se foi gerada com sucesso...
                    if (cId != null) {
                        newCols.push(cId);


                        // Gera os objetos que representam as regras para as colunas de dados da nova tabela.
                        for (var it in parConfig) {
                            var c = parConfig[it];
                            var nCol = _ct.CreateNewType(c.Name, c.Type, c.Length, c.Min, c.Max, c.RefType,
                                                     c.AllowSet, c.AllowNull, c.AllowEmpty, c.Unique, c.ReadOnly, c.Default, c.FormatSet);

                            if (nCol != null) {
                                newCols.push(nCol);
                            }
                            else {
                                r = false;
                                break;
                            }
                        }


                        // Adiciona as regras criadas para a tabela de dados alvo
                        if (r) {
                            for (var it in newCols) {
                                var nCol = newCols[it];
                                r = _alterTableSetColumn(parTable, nCol);
                                if (!r) { break; }
                            }

                            // Efetua integração com a biblioteca "Forms"
                            if (CodeCraft.Forms !== undefined) {
                                CodeCraft.Forms.AddNewCollection(parTable, newCols);
                            }
                        }


                    }

                }
            }

            _nextProcessId++;
            return r;
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

            var tab = _selectTable(parTable);
            if (tab == null) {
                _registerError(DataBaseError.TableDoesNotExist, 'Table "' + parTable + '" Does Not Exist.');
            }
            else {
                r = tab.Rows.length;
            }

            _nextProcessId++;
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

            var tab = _selectTable(parTable);
            if (tab == null) {
                _registerError(DataBaseError.TableDoesNotExist, 'Table "' + parTable + '" Does Not Exist.');
            }
            else {
                for (var it in tab.Rows) {
                    if (tab.Rows[it]['Id'] == Id) {
                        r = true;
                        break;
                    }
                }
            }

            _nextProcessId++;
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
        * @paran {Boolean}                      [getNew = false]                Quando true, retornará o novo objeto persistido ou False caso tenha ocorrido algum erro.
        *
        * @return {Boolean | [Object | False]}
        */
        InsertInto: function (parTable, rowData, getNew) {
            var r = false;
            getNew = (getNew === undefined) ? false : getNew;

            var tab = _selectTable(parTable);
            if (tab == null) {
                _registerError(DataBaseError.TableDoesNotExist, 'Table "' + parTable + '" Does Not Exist.');
            }
            else {

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
                                    if (_bt.IsNotNullValue(val)) {
                                        val = CodeCraft.DataBase.SaveOrUpdate(cRule.RefType, val);
                                        _nextProcessId--;
                                    }
                                    else {
                                        val = null;
                                    }

                                    break;

                                case 'Object[]':
                                    if (!_bt.IsArray(val) || !_bt.IsNotNullValue(val)) {
                                        val = [];
                                    }
                                    else {
                                        var nVal = [];
                                        var isOK = true;

                                        // Enquanto não houver erros, processa objetos filhos...
                                        for (var it in val) {
                                            if (isOK) {
                                                var nO = CodeCraft.DataBase.SaveOrUpdate(cRule.RefType, val[it]);
                                                _nextProcessId--;

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
                                                _nextProcessId--;
                                            }
                                        }

                                        val = nVal;
                                    }


                                    break;

                                default:
                                    val = cRule.CheckValue(val);

                                    // Verifica regra de valor único
                                    if (cRule.Unique && _bt.IsNotNullValue(val)) {
                                        for (var ri in tab.Rows) {
                                            if (tab.Rows[ri][cRule.Name] == val) {
                                                _registerError(DataBaseError.UniqueConstraintViolated, 'Unique Constraint Violated For Column "' + cRule.Name + '", Value ["' + val + '"].');
                                                val = undefined;
                                                break;
                                            }
                                        }
                                    }

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


            _nextProcessId++;
            if (getNew && r === true) {
                return CodeCraft.DataBase.SelectObject(parTable, _retrieveLastId(parTable));
            }
            else {
                return r;
            }
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
        * @paran {Boolean}                      [getNew = false]                Quando true, retornará o novo objeto persistido ou False caso tenha ocorrido algum erro.
        *
        * @return {Boolean | [Object | False]}
        */
        UpdateSet: function (parTable, rowData, getNew) {
            var r = false;
            getNew = (getNew === undefined) ? false : getNew;


            // Apenas se há um Id definido
            if (rowData['Id'] === undefined) {
                _registerError(DataBaseError.InvalidOrNullDataObject, 'Invalid Or Null DataObject.');
            }
            else {
                var Id = rowData['Id'];

                var tab = _selectTable(parTable);
                if (tab == null) {
                    _registerError(DataBaseError.TableDoesNotExist, 'Table "' + parTable + '" Does Not Exist.');
                }
                else {


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
                                        if (_bt.IsNotNullValue(val)) {
                                            val = CodeCraft.DataBase.SaveOrUpdate(cRule.RefType, val);
                                            _nextProcessId--;
                                        }
                                        else {
                                            val = null;
                                        }

                                        break;

                                    case 'Object[]':
                                        if (!_bt.IsArray(val) || !_bt.IsNotNullValue(val)) {
                                            val = [];
                                        }
                                        else {
                                            var nVal = [];
                                            var isOK = true;

                                            // Enquanto não houver erros, processa objetos filhos...
                                            for (var it in val) {
                                                if (isOK) {
                                                    var nO = CodeCraft.DataBase.SaveOrUpdate(cRule.RefType, val[it]);
                                                    _nextProcessId--;

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
                                                    _nextProcessId--;
                                                }
                                            }

                                            val = nVal;
                                        }


                                        break;

                                    default:
                                        val = cRule.CheckValue(val);

                                        // Verifica regra de valor único
                                        if (cRule.Unique && _bt.IsNotNullValue(val)) {
                                            for (var ri in tab.Rows) {
                                                if (tab.Rows[ri][cRule.Name] == val) {
                                                    _registerError(DataBaseError.UniqueConstraintViolated, 'Unique Constraint Violated For Column "' + cRule.Name + '", Value ["' + val + '"].');
                                                    val = undefined;
                                                    break;
                                                }
                                            }
                                        }
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


            _nextProcessId++;
            if (getNew && r === true) {
                return CodeCraft.DataBase.SelectObject(parTable, rowData['Id']);
            }
            else {
                return r;
            }
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
            else {
                _registerError(DataBaseError.InvalidOrNullDataObject, 'Invalid Or Null DataObject.');
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

            var tab = _selectTable(parTable);
            if (tab == null) {
                _registerError(DataBaseError.TableDoesNotExist, 'Table "' + parTable + '" Does Not Exist.');
            }
            else {
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

            _nextProcessId++;
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

            var tab = _selectTable(parTable);
            if (tab == null) {
                _registerError(DataBaseError.TableDoesNotExist, 'Table "' + parTable + '" Does Not Exist.');
            }
            else {
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

            _nextProcessId++;
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


            var tab = _selectTable(parTable);
            if (tab == null) {
                _registerError(DataBaseError.TableDoesNotExist, 'Table "' + parTable + '" Does Not Exist.');
            }
            else {
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



            _nextProcessId++;
            return o;
        }
    };


    return _public;
});