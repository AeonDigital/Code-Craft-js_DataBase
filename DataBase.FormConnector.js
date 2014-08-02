/**
* @package Code Craft
* @pdesc Conjunto de soluções front-end.
*
* @module FormConnector
* @file JS FormConnector.
*
* @author Rianna Cantarelli <rianna.aeon@gmail.com>
*/







// --------------------
// Caso não exista, inicia objeto CodeCraft
var CodeCraft = (CodeCraft || function () { });
if(typeof(CodeCraft) === 'function') { CodeCraft = new CodeCraft(); };






/**
* Expõe uma extenção do objeto "CodeCraft.DataBase" permitindo
* que campos de formulários sejam conectados a campos definidos em tabelas no DB adicionando
* assim validação e regras definidas para o campo indicado.
*
* @class FormConnector
*
* @memberof DataBase
*
* @static
*
* @type {Class}
*/
CodeCraft.DataBase.FormConnector = new (function () {
    var _bt = CodeCraft.BasicTools;
    var _dom = CodeCraft.BasicDOM;





    /* ----------
    EXEMPLO DE MARCAÇÃO PARA CONECTAR UM CAMPO NO HTML AO BANCO DE DADOS VIRTUAL


    1 - HTML

    Atributos
    data-db-fieldname       :       indica qual tabela e coluna o campo está representando.
    data-db-id              :       Id do objeto no banco que está sendo apresentado/editado. Zero indica um novo objeto.
    data-db-view-id         :       Id de controle para unificar campos de inumeras tabelas mas que pertencem a um mesmo objeto.


    <div>
        <label for="Client_Agent_FullName">Nome</label>
        <input type="text" id="Client_Agent_FullName" name="Client_Agent_FullName" class="iCommom small-fix"
            data-db-fieldname="Agent.FullName" data-db-id="0" data-db-view-id="0" 
            title="Nome do representante" />
    </div>

    <div>
        <label for="Client_Agent_Email">Email para contato</label>
        <input type="text" id="Client_Agent_Email" name="Client_Agent_Email" class="iCommom"
            data-db-fieldname="Agent.Email" data-db-id="0" data-db-view-id="0" 
            title="Email para contato" />
    </div>                                   



    2 - JAVASCRIPT

    Exemplo do código que gera a tabela "Agent" com as colunas "FullName" e "Email".
    Para mais detalhes verifique a classe "CodeCraft.DataBase"


    Agent: [
    CodeCraft.DataBase.CreateDataTableColumn('FullName', 'String', 64, null, null, null, 
                                            true, false, false, true, false, null, null),
    CodeCraft.DataBase.CreateDataTableColumn('Email', 'String', null, null, null, null, 
                                            true, false, false, false, false, null, String.Pattern.World.Email)
    ];

    CodeCraft.DataBase.CreateTable('Agent', Agent);
    CodeCraft.DataBase.FormConnector.ConnectFields();



    ---------- */










    /*    * Objeto resultante da validação de um formulário.
    * 
    * @typedef {ValidateFormResult}
    *
    * @property {Node}                          Field                               Elemento que falhou.
    * @property {ValidateError}                 ErrorType                           Tipo do erro de validação.
    * @property {String}                        Message                             Mensagem de erro amigável.
    */


















    /*
    * PROPRIEDADES PRIVADAS
    */



    /**
    * Tipos de erros para a validação de campos de formulários.
    *
    * @memberof FormConnector
    *
    * @enum ValidateError
    *
    * @type {String}
    *
    * @readonly
    */
    var ValidateError = {
        /** 
        * Valor do atributo "data-db-fieldname" é inválido. 
        *
        * @memberof ValidateError
        */
        InvalidFieldNameSet: 'InvalidFieldNameSet',
        /**
        * Tabela ou Coluna definida não existe.
        *
        * @memberof ValidateError
        */
        TableOrColumnDoesNotExist: 'TableOrColumnDoesNotExist',
        /**
        * Valor obrigatorio não foi informado.
        *
        * @memberof ValidateError
        */
        RequiredValueNotSet: 'RequiredValueNotSet',
        /**
        * Valor informado é inválido.
        *
        * @memberof ValidateError
        */
        InvalidValue: 'InvalidValue',
        /**
        * Tipo do valor é inválido.
        *
        * @memberof ValidateError
        */
        InvalidType: 'InvalidType',
        /**
        * O valor informado é maior que o tamanho do campo.
        *
        * @memberof ValidateError
        */
        MaxLengthExceeded: 'MaxLengthExceeded',
        /**
        * O valor informado excedeu os limites definidos.
        *
        * @memberof ValidateError
        */
        ValueOutOfRange: 'ValueOutOfRange',
        /**
        * Algum valor deve ser selecionado.
        *
        * @memberof ValidateErrorLabels
        */
        ValueNotSelected: 'ValueNotSelected'
    };





















    /*
    * MÉTODOS PRIVADOS
    */



    /**
    * Resgata o nome pelo qual o campo é chamado.
    * 
    * @function _getFieldName
    *
    * @private
    *
    * @param {Node}                         f                               Campo cujo nome será identificado.
    *
    * @return {String}
    */
    var _getFieldName = function (f) {
        var n = '';

        if (f.hasAttribute('title')) {
            n = f.getAttribute('title');
        }
        else if (f.hasAttribute('id')) {
            var l = _dom.Get('label[for="' + f.id + '"]');
            if (l !== null) {
                n = l[0].textContent;
            }
        }

        if (n == '' && f.hasAttribute('name')) {
            n = f.getAttribute('name');
        }

        return n;
    };

















    /**
    * OBJETO PÚBLICO QUE SERÁ EXPOSTO.
    */
    var public = this.Control = {
        /**
        * Legendas para mensagens de erro amigáveis.
        *
        * @memberof FormConnector
        *
        * @enum ValidateErrorLabels
        *
        * @type {String}
        */
        ValidateErrorLabels: {
            /**
            * Título para alertas de falha ao preenchimento de algum campo de formulário.
            *
            * @memberof ValidateErrorLabels
            *
            * @type {String}
            */
            FormErrorTitleAlert: 'The following errors were found:',
            /** 
            * Valor do atributo "data-db-fieldname" é inválido. 
            *
            * @memberof ValidateErrorLabels
            */
            InvalidFieldNameSet: 'The value "{label}" of attribute "data-db-fieldname" is invalid.',
            /**
            * Tabela ou Coluna definida não existe.
            *
            * @memberof ValidateErrorLabels
            */
            TableOrColumnDoesNotExist: 'Table or column does not exist.\n[data-db-fieldname="{label}"]',
            /**
            * Valor obrigatorio não foi informado.
            *
            * @memberof ValidateErrorLabels
            */
            RequiredValueNotSet: 'The field "{label}" must be filled.',
            /**
            * Valor informado é inválido.
            *
            * @memberof ValidateErrorLabels
            */
            InvalidValue: 'Preencha corretamente o campo "{label}".',
            /**
            * Tipo do valor é inválido.
            *
            * @memberof ValidateErrorLabels
            */
            InvalidType: 'Properly fill the field "{label}".',
            /**
            * O valor informado é maior que o tamanho do campo.
            *
            * @memberof ValidateErrorLabels
            */
            MaxLengthExceeded: 'The field "{label}" is too long.',
            /**
            * O valor informado excedeu os limites definidos.
            *
            * @memberof ValidateErrorLabels
            */
            ValueOutOfRange: 'The value of field "{label}" is out of range',
            /**
            * Mensagem para campo select onde nenhuma opção está selecionada.
            *
            * @memberof ValidateErrorLabels
            */
            ValueNotSelected: 'You must select an option from the field "{label}".'
        },










        /**
        * Conecta todos os campos marcados com as regras das colunas de dados que eles representam.
        * 
        * @function ConnectFields
        *
        * @memberof FormConnector
        */
        ConnectFields: function () {
            var tgtInputs = _dom.Get('input, textarea, select');
            var isOk = true;
            var d = true;

            //'[data-db-fieldname]'
            for (var it in tgtInputs) {
                var f = tgtInputs[it];

                if (isOk && f.hasAttribute('data-db-fieldname')) {
                    var dbfn = f.getAttribute('data-db-fieldname');
                    var cRule = null;

                    // Nome da Tabela e Coluna que o campo deve representar
                    var fn = dbfn.split('.');
                    if (fn.length != 2) {
                        console.log('Input has an invalid value for attribute "data-db-fieldname". Found "' + dbfn + '".');
                        isOk = false;
                    }
                    else {
                        cRule = CodeCraft.DataBase.RetrieveColumnRules(fn[0], fn[1]);
                        if (cRule != null) {
                            isOk = true;
                        }
                    }



                    // Não encontrando erros ...
                    if (isOk) {
                        var ft = _bt.GetFieldType(f);


                        if (ft.IsField || ft.IsTextArea || ft.IsSelect) {
                            if (cRule.AllowSet === false) { f.setAttribute('disabled', 'disabled'); }
                            if (cRule.AllowNull === false && !f.hasAttribute('required')) { f.setAttribute('required', 'required'); }

                            // Sets para Campos Comuns ou TextArea
                            if (!ft.IsSelect) {
                                if (cRule.Length != null) { f.setAttribute('maxlength', cRule.Length); }
                                if (cRule.Min != null) { f.setAttribute('min', cRule.Min); }
                                if (cRule.Max != null) { f.setAttribute('max', cRule.Max); }

                                // Se o campo permite insert E está marcado como ReadOnly
                                // verifica se o valor atual está definido...
                                if (cRule.AllowSet === true && cRule.ReadOnly === true && _bt.IsNotNullValue(f.value)) {
                                    f.setAttribute('readonly', 'readonly');
                                }
                            }



                            // Seta o valor padrão caso nenhum seja informado
                            if (cRule.Default != null && f.value == '') {
                                if (cRule.Type.Name === 'Date' && cRule.Default === 'new') {
                                    var val = new Date();
                                    var use = (String.Pattern != undefined) ? String.Pattern.World.Dates.DateTime : null;
                                    use = (cRule.SuperTypeSet != null && cRule.SuperTypeSet.Format != null) ? cRule.SuperTypeSet : use;

                                    if (_bt.IsNotNullValue(use)) {
                                        f.value = use.Format(val);
                                    }
                                }
                                else {
                                    f.value = cRule.Default;
                                }
                            }


                            // Adiciona verificador/formatador
                            var fc = CodeCraft.DataBase.FormConnector;
                            if (ft.IsField || ft.IsTextArea) {
                                f.removeEventListener('keyup', fc.CheckAndFormatField, false);
                                f.addEventListener('keyup', fc.CheckAndFormatField, false);
                            }
                            else {
                                f.removeEventListener('change', fc.CheckAndFormatField, false);
                                f.addEventListener('change', fc.CheckAndFormatField, false);
                            }
                            fc.CheckAndFormatField({ target: f, check: false });
                        }
                    }

                }
            }
        },





        /**
        * A partir das configurações definidas para o campo, verifica se seu valor é válido.
        * No caso do valor encontrado ser válido e haver uma formatação prevista, esta será aplicada
        * 
        * @function CheckAndFormatField
        *
        * @memberof FormConnector
        *
        * @param {Node}                         o                               Elemento que será validado.
        * @param {Boolean}                      [r = true]                      Quando "true" irá retornar um valor booleano, senão, 
        *                                                                       retornará o código do erro em caso de falha ou True em caso de sucesso.
        *
        * @return {Boolean|[True|ValidateError]}
        */
        CheckAndFormatField: function (o, r) {
            var c = (o.check !== undefined) ? o.check : true;
            var r = (r === undefined) ? true : r;
            var o = o.target;
            var validate = (o.hasAttribute('data-validate')) ? _bt.TryParse.ToBoolean(!o.getAttribute('data-validate')) : true;
            var isValid = false;


            // Se o campo não deve ser validado, ou, se não possui marcação que 
            // possibilite enquadra-lo em alguma regra de validação... ignora-o
            if (!validate || !o.hasAttribute('data-db-fieldname')) {
                isValid = true;
            }
            else {
                var dbfn = o.getAttribute('data-db-fieldname');
                var cRule = null;


                // Nome da Tabela e Coluna que o campo deve representar
                var fn = dbfn.split('.');

                if (fn.length != 2) {
                    isValid = (r === true) ? false : ValidateError.InvalidFieldNameSet;
                }
                else {
                    cRule = CodeCraft.DataBase.RetrieveColumnRules(fn[0], fn[1]);

                    if (cRule == null) {
                        isValid = (r === true) ? false : ValidateError.TableOrColumnDoesNotExist;
                    }
                    else {
                        var ft = _bt.GetFieldType(o);
                        var val = o.value;
                        var req = (_bt.IsNotNullValue(o.required)) ? _bt.TryParse.ToBoolean(o.required) : false;


                        // Verifica valores obrigatórios
                        if (req && o.value == '') {
                            var err = (ft.IsSelect) ? ValidateError.ValueNotSelected : ValidateError.RequiredValueNotSet;
                            isValid = (r === true) ? false : err;
                        }
                        else {

                            // Campos select não passam pelas validações a seguir.
                            if (ft.IsSelect) {
                                isValid = true;
                            }
                            else {
                                var ss = (_bt.IsNotNullValue(cRule.SuperTypeSet)) ? cRule.SuperTypeSet : null;

                                // Verifica se a string é válida dentro das especificações do SuperType
                                isValid = (ss != null && _bt.IsNotNullValue(ss.Check)) ? ss.Check(val) : true;

                                if (!isValid) {
                                    isValid = (r === true) ? false : ValidateError.InvalidValue;
                                }
                                else {
                                    // Força para que o valor retorne ao seu tipo original
                                    val = (ss != null && ss.RemoveFormat != null) ? ss.RemoveFormat(val) : val;
                                    val = cRule.Type.TryParse(val, cRule.RefType);


                                    // Valida o valor conforme o tipo de dado da coluna,
                                    // ENUNs são testados aqui
                                    isValid = cRule.Type.Validate(val, cRule.RefType);

                                    if (!isValid) {
                                        isValid = (r === true) ? false : ValidateError.InvalidType;
                                    }
                                    else {
                                        switch (cRule.Type.Name) {
                                            // Verificação para String                                     
                                            case 'String':
                                                // Havendo um formatador, executa-o
                                                val = (ss != null && ss.Format != null) ? ss.Format(val) : val;


                                                // Verifica tamanho.
                                                if (cRule.Length != null && val.length > cRule.Length) {
                                                    isValid = (r === true) ? false : ValidateError.MaxLengthExceeded;
                                                }

                                                break;

                                            // Verificação para Numerais e Date                                    
                                            case 'Date':
                                            case 'Byte':
                                            case 'Short':
                                            case 'Integer':
                                            case 'Long':
                                            case 'Float':
                                            case 'Double':
                                                if (val < cRule.Min || val > cRule.Max) {
                                                    isValid = (r === true) ? false : ValidateError.ValueOutOfRange;
                                                }

                                                break;
                                        }



                                        if (isValid && ss != null && ss.Format != null) {
                                            o.value = ss.Format(val);
                                        }
                                    }
                                }
                            }
                        }


                        if (c) {
                            o.setAttribute('data-valid', ((isValid === true) ? true : false));
                            isValid = true;
                        }
                    }
                }
            }


            return isValid;
        },





        /**
        * Valida todos os campos encontrados para o formulário alvo.
        * Retorna True caso todos passem ou um array com objetos "ValidateFormResult" referentes
        * aos campos que falharam na validação.
        * 
        * @function CheckAllFormFields
        *
        * @memberof FormConnector
        *
        * @param {Node}                             f                                   Elemento "form" que terá seus campos validados.
        * @param {JSON}                             [labels]                            Mensagens amigáveis para serem mostradas ao usuário.
        *                                                                               Se não forem definidas usará o objeto "ValidateErrorLabels"
        *
        * @return {True|ValidateFormResult[]}
        */
        CheckAllFormFields: function (f, labels) {
            var errors = [];
            var fc = CodeCraft.DataBase.FormConnector;
            var tgtInputs = _dom.Get('[data-db-fieldname]', f);
            labels = (labels === undefined) ? fc.ValidateErrorLabels : labels;


            for (var it in tgtInputs) {
                f = tgtInputs[it];
                var r = fc.CheckAndFormatField(f, false);

                if (r !== true) {

                    var msg = labels[r];
                    var lbl = (r == 'InvalidFieldNameSet' ||
                                r == 'TableOrColumnDoesNotExist') ? f.getAttribute('data-db-fieldname') : _getFieldName(f);

                    errors.push({
                        Field: f,
                        ErrorType: r,
                        Message: labels[r].replace('{label}', lbl)
                    });
                }
            }


            return (errors.length === 0) ? true : errors;
        }
    };


    return public;
});