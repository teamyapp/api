module.exports.requestHooks = [
    context => {
        const params = context
            .request
            .getParameters()
            .sort((param1, param2) => param1.name.length - param2.name.length);

        const url = new URL(context.request.getUrl());
        const body = context.request.getBody();
        let path = url.pathname;
        let bodyText = body.text;
        for (const {name, value} of params) {
            if (!name) continue;

            const urlParamPattern = `:${name}`;
            const bodyParamPattern = '${' + name + '}';
            if (path.includes(urlParamPattern)) {
                path = path.replaceAll(urlParamPattern, encodeURIComponent(value));
                url.pathname = path;
                context.request.removeParameter(name);
            } else if (bodyText.includes(bodyParamPattern)) {
                bodyText = bodyText.replaceAll(bodyParamPattern, value);
                context.request.removeParameter(name);
            }
        }

        context.request.setUrl(url.toString());
        body.text = bodyText;
        context.request.setBody(body);
    },
];