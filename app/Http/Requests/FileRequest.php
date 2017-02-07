<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
      $rules = [
//        "id"=>"integer"
      ];
//      $nbr = count($this->input('files')) - 1;
//      foreach(range(0, $nbr) as $index) {
//        $rules['files.' . $index] = 'files|required';
//      }

      return $rules;
    }
}
