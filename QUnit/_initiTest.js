var SetTestDataBase = function () {
    var Endereco = [{
            Name: 'Logradouro',
            Type: 'String',
            AllowSet: true,
            AllowNull: false,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'Numero',
            Type: 'Short',
            AllowSet: true,
            AllowNull: false,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        }
    ];



    var Telefone = [{
            Name: 'Numero',
            Type: 'String',
            AllowSet: true,
            AllowNull: false,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'Movel',
            Type: 'Boolean',
            AllowSet: true,
            AllowNull: false,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: false,
            Default: true,
            FormatSet: null
        }
    ];



    var Cliente = [{
            Name: 'Nome',
            Type: 'String',
            AllowSet: true,
            AllowNull: false,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'Login',
            Type: 'String',
            AllowSet: true,
            AllowNull: false,
            AllowEmpty: false,
            Unique: true,
            ReadOnly: true,
            Default: null,
            FormatSet: String.Pattern.World.Email
        },
        {
            Name: 'Senha',
            Type: 'String',
            AllowSet: true,
            AllowNull: false,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'CPF',
            Type: 'String',
            AllowSet: true,
            AllowNull: true,
            AllowEmpty: false,
            Unique: true,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'CNPJ',
            Type: 'String',
            AllowSet: true,
            AllowNull: true,
            AllowEmpty: false,
            Unique: true,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'DataNascimento',
            Type: 'Date',
            AllowSet: true,
            AllowNull: false,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: true,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'Idade',
            Type: 'Integer',
            AllowSet: false,
            AllowNull: false,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: true,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'Endereco',
            Type: 'Object',
            RefType: 'Endereco',
            AllowSet: true,
            AllowNull: true,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        },
        {
            Name: 'Telefones',
            Type: 'Object[]',
            RefType: 'Telefone',
            AllowSet: true,
            AllowNull: true,
            AllowEmpty: false,
            Unique: false,
            ReadOnly: false,
            Default: null,
            FormatSet: null
        }
    ];



    if (DataBase.CreateTable('Cliente', Cliente)) {
        DataBase.CreateTable('Telefone', Telefone);
        DataBase.CreateTable('Endereco', Endereco);


        if (DataBase.CreateTable('Cliente', Cliente)) {
            alert('1 - Erro ao inserir tabela.')
        }
        else {
            SetTestsObject();
        }
    }
    else {
        alert('2- Erro ao inserir tabela.')
    }
};



var TestObject = function () {
    return {
        Nome: 'Fulano de tal',
        Login: 'FULANODETAL@GMAIL.COM',
        Senha: '123456',
        CPF: null,
        CNPJ: null,
        DataNascimento: new Date(2000, 4, 17),
        Idade: 10,
        Endereco: null,
        Telefones: null
    };
};



var SetTestsObject = function () {
    var o1 = {
        Nome: 'Segundo fulano que não será adicionado',
        Login: 'FULANODETAL@GMAIL.COM',
        Senha: '654321',
        CPF: '111',
        CNPJ: null,
        DataNascimento: new Date(2001, 4, 17),
        Endereco: null,
        Telefones: null
    };
    var o2 = {
        Nome: 'Segundo',
        Login: 'segundo@fulano.com',
        Senha: '654321',
        CPF: '111',
        CNPJ: null,
        DataNascimento: new Date(2010, 4, 17),
        Endereco: null,
        Telefones: null
    };
    var o3 = {
        Nome: 'Terceiro',
        Login: 'terceiro@fulano.com',
        Senha: '111222',
        CPF: '222',
        CNPJ: null,
        DataNascimento: new Date(2014, 4, 17),
        Endereco: null,
        Telefones: null
    };
    var o4 = {
        Nome: 'Quarto',
        Login: 'quarto@fulano.com',
        Senha: '654321',
        CPF: '333',
        CNPJ: null,
        DataNascimento: new Date(1998, 4, 17),
        Endereco: null,
        Telefones: null
    };
    var o5 = {
        Nome: 'Quinto',
        Login: 'quinto@fulano.com',
        Senha: '654321',
        CPF: '444',
        CNPJ: null,
        DataNascimento: new Date(1999, 4, 17),
        Endereco: null,
        Telefones: null
    };
    var o6 = {
        Nome: 'Sexto',
        Login: 'sexto@fulano.com',
        Senha: '111222',
        CPF: '555',
        CNPJ: null,
        DataNascimento: new Date(2005, 4, 17),
        Endereco: null,
        Telefones: null
    };
    var o7 = {
        Nome: 'Setimo',
        Login: 'setimo@fulano.com',
        Senha: '654321',
        CPF: '666',
        CNPJ: null,
        DataNascimento: new Date(2008, 4, 17),
        Endereco: null,
        Telefones: null
    };

    var o0 = TestObject();
    DataBase.InsertInto('Cliente', o0);
    DataBase.InsertInto('Cliente', o1);
    DataBase.InsertInto('Cliente', o2);
    DataBase.InsertInto('Cliente', o3);
    DataBase.InsertInto('Cliente', o4);
    DataBase.InsertInto('Cliente', o5);
    DataBase.InsertInto('Cliente', o6);
    DataBase.InsertInto('Cliente', o7);
};
