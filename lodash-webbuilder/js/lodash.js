define(['fs', 'vm'], function(fs, vm){
    var src = fs.readFileSync('lodash/lodash.js');
    return vm.runInContext(src, {});
});
